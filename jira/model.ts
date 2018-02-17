type UNKNOWN = any;

export interface ApiObject {
  self: string; // "https://citypantry.atlassian.net/rest/api/2/issuetype/1";
}

export type IssueKey = string;

export interface JiraCommentEvent {
  timestamp: number; // Milliseconds e.g. 1518873292317
  webhookEvent: 'comment_deleted' | 'comment_created' | 'jira:issue_updated' | UNKNOWN; // TODO
  comment: Comment;
  issue: SimpleIssue;
}

export interface JiraIssueEvent {
  timestamp: number; // Milliseconds e.g. 1518873292317
  webhookEvent: "jira:issue_updated" | UNKNOWN;
  issue_event_type_name: "issue_assigned" | UNKNOWN;
  user: User;
  issue: DetailedIssue;
  changelog: Changelog;
}

export interface User extends ApiObject {
  name: string; //"paul";
  key: string; //"paul";
  accountId: string; //"557058:faaac56e-3bb4-43b2-88d2-ccedadca7d31";
  avatarUrls: AvatarUrls;
  displayName: string; //"Paul Lessing";
  active: boolean;
  timeZone: string; //"Europe/London"
  emailAddress?: string; // "paul@citypantry.com";
}

export interface Comment extends ApiObject {
  id: string; // "30341";
  author: User;
  body: string; // "Adding new comment";
  updateAuthor: User;
  created: string; // "2018-02-17T12:52:23.827+0000";
  updated: string; // "2018-02-17T12:52:23.827+0000"
}

export interface SimpleIssue extends ApiObject {
  id: string; // numeric
  key: IssueKey; // "CPD-2541";
  fields: IssueFields;
}

interface DetailedIssue extends SimpleIssue {
  fields: DetailedIssueFields;
}

interface FullIssue extends DetailedIssue {
  fields: FullIssueFields;
}

export interface IssueFields {
  summary: string; // "TEST BUG PLEASE IGNORE";
  issuetype: IssueType;
  project: Project;
  assignee: User;
  priority: Priority;
  status: Status;
}

export interface DetailedIssueFields extends IssueFields, CustomFields {
  description: string; // "@paul related";
  creator: User;
  reporter: User;
  assignee: User;
  lastViewed: string; // "2018-02-17T13:14:52.159+0000";
  created: string; // "2018-02-16T17:59:27.732+0000";
  updated: string; // "2018-02-17T13:14:52.224+0000";

  aggregateprogress: Progress;
  progress: Progress;
  votes: {
    self: string; // "https://citypantry.atlassian.net/rest/api/2/issue/CPD-2541/votes";
    votes: number;
    hasVoted: boolean;
  };
  watches: {
    self: string; // "https://citypantry.atlassian.net/rest/api/2/issue/CPD-2541/watchers";
    watchCount: number; // 0
    isWatching: boolean;
  };

  timespent: UNKNOWN | null;
  fixVersions: UNKNOWN[];
  aggregatetimespent: UNKNOWN | null;
  resolution: UNKNOWN | null;
  resolutiondate: UNKNOWN | null;
  workratio: number; // -1

  labels: UNKNOWN[];
  aggregatetimeoriginalestimate: UNKNOWN | null;
  timeestimate: UNKNOWN | null;
  versions: UNKNOWN[];
  issuelinks: UNKNOWN[];
  components: UNKNOWN[];
  timeoriginalestimate: UNKNOWN | null;
  timetracking: UNKNOWN;
  security: UNKNOWN | null;
  attachment: UNKNOWN[];
  aggregatetimeestimate: UNKNOWN | null;
  subtasks: UNKNOWN[];
  environment: UNKNOWN;
  duedate: UNKNOWN;
}

export interface FullIssueFields extends DetailedIssueFields {
  comment: {
    comments: Comment[];
    maxResults: number; // 2,
    total: number; // 2,
    startAt: number; // 0
  }
}

export interface IssueType extends ApiObject {
  id: string; // "1";
  description: string; // "A problem which impairs or prevents the functions of the product.";
  iconUrl: string; // "https://citypantry.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10303&avatarType=issuetype";
  name: string; // "Bug";
  subtask: boolean; // false;
  avatarId: number; // 10303
}

export interface Project extends ApiObject {
  id: string; // "10000";
  key: string; // "CPD";
  name: string; // "City Pantry Dev";
  projectTypeKey: string; // "software";
  avatarUrls: AvatarUrls;
}

export interface AvatarUrls {
  "48x48": string; // "https://citypantry.atlassian.net/secure/projectavatar?pid=10000&avatarId=12065";
  "24x24": string; // "https://citypantry.atlassian.net/secure/projectavatar?size=small&pid=10000&avatarId=12065";
  "16x16": string; // "https://citypantry.atlassian.net/secure/projectavatar?size=xsmall&pid=10000&avatarId=12065";
  "32x32": string; // "https://citypantry.atlassian.net/secure/projectavatar?size=medium&pid=10000&avatarId=12065"
}

export interface Priority extends ApiObject {
  self: string; // "https://citypantry.atlassian.net/rest/api/2/priority/3";
  iconUrl: string; // "https://citypantry.atlassian.net/images/icons/priorities/medium.svg";
  name: string; // "Medium";
  id: string; // "3"
}

export interface Status extends ApiObject {
  description: string; // "";
  iconUrl: string; // "https://citypantry.atlassian.net/images/icons/subtask.gif";
  name: string; // "To Do";
  id: string; // "10000";
  statusCategory: StatusCategory;
}

export interface StatusCategory extends ApiObject {
  id: number; // 2;
  key: string; // "new";
  colorName: string; // "blue-gray";
  name: string; // "To Do"
}

export interface Progress {
  progress: number;
  total: number;
}

export interface Changelog {
  id: string; // "58069";
  items: {
    field: string; // "assignee";
    fieldtype: string; // "jira";
    fieldId: string; // "assignee";
    from: any; // null;
    fromString: string; // null;
    to: any; // "paul";
    toString: string; // "Paul Lessing"
  }[];
}

export interface CustomFields {
  customfield_10000: UNKNOWN | null;
  customfield_10001: UNKNOWN | null;
  customfield_10003: UNKNOWN | null;
  customfield_10004: UNKNOWN | null;
  customfield_10005: UNKNOWN | null;
  customfield_10007: UNKNOWN[];
  customfield_10008: UNKNOWN | null;
  customfield_10012: string; // "0|i00bfq:";
  customfield_10014: UNKNOWN | null;
  customfield_10015: UNKNOWN | null;
  customfield_10016: UNKNOWN | null;
  customfield_10017: UNKNOWN | null;
  customfield_10018: UNKNOWN | null;
  customfield_10019: UNKNOWN | null;
  customfield_10020: UNKNOWN | null;
  customfield_10021: UNKNOWN | null;
  customfield_10022: UNKNOWN | null;
  customfield_10023: UNKNOWN | null;
  customfield_10100: UNKNOWN | null;
  customfield_10200: UNKNOWN | null;
  customfield_10300: string; // "{}";
  customfield_10400: UNKNOWN | null;
  customfield_10500: UNKNOWN | null;
  customfield_10501: UNKNOWN | null;
  customfield_10700: UNKNOWN | null;
  customfield_10800: UNKNOWN | null;
  customfield_10910: UNKNOWN | null;
}

export function isApiObject(o): o is ApiObject {
  return o && o.hasOwnProperty('self') && typeof o.self === 'string';
}
