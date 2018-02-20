import { Changelog, ChangelogEntry, Comment, Issue, IssueWithSummaryAndComments, JiraIssueEvent } from '../models/jira';
import { jiraApi } from '../api/jira.api';
import * as moment from 'moment';
import { getUnique } from '../util/array';
import { isSameUser, parseUser, SlackUser } from '../models/slack-user.model';

export const COMMENT_HEADER = '*Users tracking this issue:* _(Please do not modify this comment)_';
export const COMMENT_FOOTER = '\n\n_I\'m a bot, beep boop. Here\'s my [source code|https://github.com/paullessing/bugs-slackbot]._';

export interface IssueUpdate {
  isRelevant: boolean;
  movedToDone?: boolean;
  movedOutOfDone?: boolean;
  isDone?: boolean;
  isClosed?: boolean;
}

export class JiraService {

  public getIssueUpdate(event: JiraIssueEvent): IssueUpdate {
    const resolution = getEntry(event.changelog, 'resolution');
    const status = getEntry(event.changelog, 'status');

    console.log(resolution, status);

    if (!resolution || !status) {
      console.log('Event does not have both resolution and status, ignoring');
      return {
        isRelevant: false
      };
    }

    const movedToDone = resolution.from === null && resolution.toString === 'Done';
    const movedOutOfDone = resolution.fromString === 'Done' && resolution.to === null;

    const isDone = status.toString === 'Done';
    const isClosed = status.toString === 'Closed';

    return {
      isRelevant: movedToDone, // TODO change to true when we care about moving out of closed
      movedToDone,
      movedOutOfDone,
      isDone,
      isClosed
    };
  }

  public async getIssueUsers(selfLink: string): Promise<SlackUser[]> {
    const issue = await jiraApi.getItem<Issue>(selfLink);
    return getAllUsers(issue);
  }

  public getUpdateMessage(event: JiraIssueEvent, users: SlackUser[]): string {
    const created = moment(event.issue.fields.created);
    const isLongAgo = created.diff(moment(), 'days') < -7;

    const message = `Issue ${event.issue.key} closed by ${event.user.displayName}:\n` +
      `*${event.issue.fields.summary}*\n` +
      `First reported ${created.fromNow()}${isLongAgo ? ` (${created.format('DD/MM/YYYY')})` : ''}.\n` +
      `Affected users: ${users.map((u) => u.display).join(', ')}`;

    console.log('Message:', message);

    return message;
  }

  public async addUsersToIssue(issueKey: string, users: SlackUser[]): Promise<{ summary: string, affectedUsers: SlackUser[] }> {
    const issue = await jiraApi.getIssueWithSummaryAndComments(issueKey);

    const usersToAdd: SlackUser[] = [];
    const existingUsers = getAllUsers(issue);

    users.forEach((user) => {
      if (!existingUsers.find((e) => isSameUser(e, user))) {
        usersToAdd.push(user);
      }
    });
    if (!usersToAdd.length) {
      return {
        summary: issue.fields.summary,
        affectedUsers: []
      };
    }
    const userString = usersToAdd.map((user) => user.display).join('\n');

    const trackingComment = this.findTrackingComment(issue);
    if (trackingComment) {
      const body = trackingComment.body.replace(/(\r\n)/g, '\n');
      const newComment = `${body.replace(COMMENT_FOOTER, '')}\n${userString}${COMMENT_FOOTER}`;
      await jiraApi.updateComment(issueKey, trackingComment.id,  newComment);
    } else {
      await jiraApi.addComment(issueKey, COMMENT_HEADER + '\n\n' + userString + COMMENT_FOOTER);
    }
    return {
      summary: issue.fields.summary,
      affectedUsers: usersToAdd
    };
  }

  private findTrackingComment(issue: IssueWithSummaryAndComments): Comment | null {
    return issue.fields.comment.comments
      .find((comment) => {
        return comment.body.indexOf(COMMENT_HEADER) === 0;
      });
  }
}

function getEntry(changelog: Changelog, fieldName: string): ChangelogEntry {
  return changelog.items.find((entry) => entry.field === fieldName);
}

function getAllUsers(issue: IssueWithSummaryAndComments): SlackUser[] {
  const users = getUnique<SlackUser>([].concat.apply(
    getUsers(issue.fields.description),
    (issue.fields.comment.comments || [])
      .map((comment) => comment.body)
      .map(getUsers)
  ), isSameUser);

  return users;
}

function getUsers(content: string): SlackUser[] {
  const regex = /(\B@[0-9a-z_.-]+|<@[0-9a-z_. -]+(?:|.*?)?>)/gmi;
  let m;

  const users = [];

  while ((m = regex.exec(content)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    const user = m[1];
    users.push(parseUser(user));
  }

  return users;
}

export const jiraService = new JiraService();
