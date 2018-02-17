type UNKNOWN = any;

export interface JiraCommentEvent {
  timestamp: number; // Milliseconds
  webhookEvent: 'comment_deleted' | 'comment_created' | 'jira:issue_updated' | UNKNOWN; // TODO
  comment: JiraComment;
  issue: JiraIssue;
}

export interface IssueType {
  self: string; // "https://citypantry.atlassian.net/rest/api/2/issuetype/1";
  id: string; // "1";
  description: string; // "A problem which impairs or prevents the functions of the product.";
  iconUrl: string; // "https://citypantry.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10303&avatarType=issuetype";
  name: string; // "Bug";
  subtask: boolean; // false;
  avatarId: number; // 10303
}

export interface Project {
  self: string; // "https://citypantry.atlassian.net/rest/api/2/project/10000";
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

export interface Priority {
  self: string; // "https://citypantry.atlassian.net/rest/api/2/priority/3";
  iconUrl: string; // "https://citypantry.atlassian.net/images/icons/priorities/medium.svg";
  name: string; // "Medium";
  id: string; // "3"
}

export interface Status {
  self: string; // "https://citypantry.atlassian.net/rest/api/2/status/10000";
  description: string; // "";
  iconUrl: string; // "https://citypantry.atlassian.net/images/icons/subtask.gif";
  name: string; // "To Do";
  id: string; // "10000";
  statusCategory: StatusCategory;
}

export interface StatusCategory {
  self: string; // "https://citypantry.atlassian.net/rest/api/2/statuscategory/2";
  id: number; // 2;
  key: string; // "new";
  colorName: string; // "blue-gray";
  name: string; // "To Do"
}

export interface JiraIssue {
  id: string; // numeric
  self: string; // "https://citypantry.atlassian.net/rest/api/2/issue/33833";
  key: string; // "CPD-2541";
  fields: {
    summary: string; // "TEST BUG PLEASE IGNORE";
    issuetype: IssueType;
    project: Project;
    assignee: UNKNOWN;
    priority: Priority;
    status: Status;
  }
}

export interface Author {
  self: string; //"https://citypantry.atlassian.net/rest/api/2/user?username=paul";
  name: string; //"paul";
  key: string; //"paul";
  accountId: string; //"557058:faaac56e-3bb4-43b2-88d2-ccedadca7d31";
  avatarUrls: AvatarUrls;
  displayName: string; //"Paul Lessing";
  active: string; //true;
  timeZone: string; //"Europe/London"
}

export interface JiraComment {
  self: string; // "https://citypantry.atlassian.net/rest/api/2/issue/33833/comment/30341";
  id: string; // "30341";
  author: Author;
  body: string; // "Adding new comment";
  updateAuthor: Author;
  created: string; // "2018-02-17T12:52:23.827+0000";
  updated: string; // "2018-02-17T12:52:23.827+0000"
}


export interface User {
  self: string; // "https://citypantry.atlassian.net/rest/api/2/user?username=paul";
  name: string; // "paul";
  key: string; // "paul";
  accountId: string; // "557058:faaac56e-3bb4-43b2-88d2-ccedadca7d31";
  emailAddress: string; // "paul@citypantry.com";
  avatarUrls: AvatarUrls;
  displayName: string; // "Paul Lessing";
  active: boolean;
  timeZone: string; // "Europe/London"
}

interface DetailedIssue {
  "id": "33833";
  "self": "https://citypantry.atlassian.net/rest/api/2/issue/33833";
  "key": "CPD-2541";
  "fields": {
    description: string; // "@paul related";

    "issuetype": {
      "self": "https://citypantry.atlassian.net/rest/api/2/issuetype/1";
      "id": "1";
      "description": "A problem which impairs or prevents the functions of the product.";
      "iconUrl": "https://citypantry.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10303&avatarType=issuetype";
      "name": "Bug";
      "subtask": false;
      "avatarId": 10303
    };
    "timespent": null;
    "project": {
      "self": "https://citypantry.atlassian.net/rest/api/2/project/10000";
      "id": "10000";
      "key": "CPD";
      "name": "City Pantry Dev";
      "projectTypeKey": "software";
      "avatarUrls": {
        "48x48": "https://citypantry.atlassian.net/secure/projectavatar?pid=10000&avatarId=12065";
        "24x24": "https://citypantry.atlassian.net/secure/projectavatar?size=small&pid=10000&avatarId=12065";
        "16x16": "https://citypantry.atlassian.net/secure/projectavatar?size=xsmall&pid=10000&avatarId=12065";
        "32x32": "https://citypantry.atlassian.net/secure/projectavatar?size=medium&pid=10000&avatarId=12065"
      }
    };
    "fixVersions": [];
    "aggregatetimespent": null;
    "resolution": null;
    "customfield_10500": null;
    "customfield_10501": null;
    "customfield_10700": null;
    "resolutiondate": null;
    "workratio": -1;
    "watches": {
      "self": "https://citypantry.atlassian.net/rest/api/2/issue/CPD-2541/watchers";
      "watchCount": 0;
      "isWatching": false
    };
    "lastViewed": "2018-02-17T13:14:52.159+0000";
    "created": "2018-02-16T17:59:27.732+0000";
    "customfield_10020": null;
    "customfield_10021": null;
    "customfield_10022": null;
    "priority": {
      "self": "https://citypantry.atlassian.net/rest/api/2/priority/3";
      "iconUrl": "https://citypantry.atlassian.net/images/icons/priorities/medium.svg";
      "name": "Medium";
      "id": "3"
    };
    "customfield_10100": null;
    "customfield_10023": null;
    "customfield_10300": "{}";
    "labels": [];
    "customfield_10016": null;
    "customfield_10017": null;
    "customfield_10018": null;
    "customfield_10019": null;
    "aggregatetimeoriginalestimate": null;
    "timeestimate": null;
    "versions": [];
    "issuelinks": [];
    "assignee": {
      "self": "https://citypantry.atlassian.net/rest/api/2/user?username=paul";
      "name": "paul";
      "key": "paul";
      "accountId": "557058:faaac56e-3bb4-43b2-88d2-ccedadca7d31";
      "emailAddress": "paul@citypantry.com";
      "avatarUrls": {
        "48x48": "https://avatar-cdn.atlassian.com/18069ed642a194f74d651d478f12b215?s=48&d=https%3A%2F%2Fcitypantry.atlassian.net%2Fsecure%2Fuseravatar%3FownerId%3Dpaul%26avatarId%3D11900%26noRedirect%3Dtrue";
        "24x24": "https://avatar-cdn.atlassian.com/18069ed642a194f74d651d478f12b215?s=24&d=https%3A%2F%2Fcitypantry.atlassian.net%2Fsecure%2Fuseravatar%3Fsize%3Dsmall%26ownerId%3Dpaul%26avatarId%3D11900%26noRedirect%3Dtrue";
        "16x16": "https://avatar-cdn.atlassian.com/18069ed642a194f74d651d478f12b215?s=16&d=https%3A%2F%2Fcitypantry.atlassian.net%2Fsecure%2Fuseravatar%3Fsize%3Dxsmall%26ownerId%3Dpaul%26avatarId%3D11900%26noRedirect%3Dtrue";
        "32x32": "https://avatar-cdn.atlassian.com/18069ed642a194f74d651d478f12b215?s=32&d=https%3A%2F%2Fcitypantry.atlassian.net%2Fsecure%2Fuseravatar%3Fsize%3Dmedium%26ownerId%3Dpaul%26avatarId%3D11900%26noRedirect%3Dtrue"
      };
      "displayName": "Paul Lessing";
      "active": true;
      "timeZone": "Europe/London"
    };
    updated: string; // "2018-02-17T13:14:52.224+0000";
    status: Status;
    "components": [];
    "timeoriginalestimate": null;
    "customfield_10012": "0|i00bfq:";
    "customfield_10014": null;
    "timetracking": {};
    "customfield_10015": null;
    "customfield_10005": null;
    "customfield_10007": [];
    "security": null;
    "customfield_10008": null;
    "customfield_10800": null;
    "attachment": [];
    "aggregatetimeestimate": null;
    "summary": "TEST BUG PLEASE IGNORE";
    "creator": {
      "self": "https://citypantry.atlassian.net/rest/api/2/user?username=paul";
      "name": "paul";
      "key": "paul";
      "accountId": "557058:faaac56e-3bb4-43b2-88d2-ccedadca7d31";
      "emailAddress": "paul@citypantry.com";
      "avatarUrls": {
        "48x48": "https://avatar-cdn.atlassian.com/18069ed642a194f74d651d478f12b215?s=48&d=https%3A%2F%2Fcitypantry.atlassian.net%2Fsecure%2Fuseravatar%3FownerId%3Dpaul%26avatarId%3D11900%26noRedirect%3Dtrue";
        "24x24": "https://avatar-cdn.atlassian.com/18069ed642a194f74d651d478f12b215?s=24&d=https%3A%2F%2Fcitypantry.atlassian.net%2Fsecure%2Fuseravatar%3Fsize%3Dsmall%26ownerId%3Dpaul%26avatarId%3D11900%26noRedirect%3Dtrue";
        "16x16": "https://avatar-cdn.atlassian.com/18069ed642a194f74d651d478f12b215?s=16&d=https%3A%2F%2Fcitypantry.atlassian.net%2Fsecure%2Fuseravatar%3Fsize%3Dxsmall%26ownerId%3Dpaul%26avatarId%3D11900%26noRedirect%3Dtrue";
        "32x32": "https://avatar-cdn.atlassian.com/18069ed642a194f74d651d478f12b215?s=32&d=https%3A%2F%2Fcitypantry.atlassian.net%2Fsecure%2Fuseravatar%3Fsize%3Dmedium%26ownerId%3Dpaul%26avatarId%3D11900%26noRedirect%3Dtrue"
      };
      "displayName": "Paul Lessing";
      "active": true;
      "timeZone": "Europe/London"
    };
    "subtasks": [];
    "reporter": {
      "self": "https://citypantry.atlassian.net/rest/api/2/user?username=paul";
      "name": "paul";
      "key": "paul";
      "accountId": "557058:faaac56e-3bb4-43b2-88d2-ccedadca7d31";
      "emailAddress": "paul@citypantry.com";
      "avatarUrls": {
        "48x48": "https://avatar-cdn.atlassian.com/18069ed642a194f74d651d478f12b215?s=48&d=https%3A%2F%2Fcitypantry.atlassian.net%2Fsecure%2Fuseravatar%3FownerId%3Dpaul%26avatarId%3D11900%26noRedirect%3Dtrue";
        "24x24": "https://avatar-cdn.atlassian.com/18069ed642a194f74d651d478f12b215?s=24&d=https%3A%2F%2Fcitypantry.atlassian.net%2Fsecure%2Fuseravatar%3Fsize%3Dsmall%26ownerId%3Dpaul%26avatarId%3D11900%26noRedirect%3Dtrue";
        "16x16": "https://avatar-cdn.atlassian.com/18069ed642a194f74d651d478f12b215?s=16&d=https%3A%2F%2Fcitypantry.atlassian.net%2Fsecure%2Fuseravatar%3Fsize%3Dxsmall%26ownerId%3Dpaul%26avatarId%3D11900%26noRedirect%3Dtrue";
        "32x32": "https://avatar-cdn.atlassian.com/18069ed642a194f74d651d478f12b215?s=32&d=https%3A%2F%2Fcitypantry.atlassian.net%2Fsecure%2Fuseravatar%3Fsize%3Dmedium%26ownerId%3Dpaul%26avatarId%3D11900%26noRedirect%3Dtrue"
      };
      "displayName": "Paul Lessing";
      "active": true;
      "timeZone": "Europe/London"
    };
    "aggregateprogress": {
      "progress": 0;
      "total": 0
    };
    "customfield_10000": null;
    "customfield_10001": null;
    "customfield_10200": null;
    "customfield_10003": null;
    "customfield_10004": null;
    "customfield_10400": null;
    "environment": null;
    "customfield_10910": null;
    "duedate": null;
    "progress": {
      "progress": 0;
      "total": 0
    };
    "votes": {
      "self": "https://citypantry.atlassian.net/rest/api/2/issue/CPD-2541/votes";
      "votes": 0;
      "hasVoted": false
    }
  }
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

export interface JiraIssueEvent {
  timestamp: number; // 1518873292317;
  webhookEvent: "jira:issue_updated" | UNKNOWN;
  issue_event_type_name: "issue_assigned" | UNKNOWN;
  user: User;
  issue: DetailedIssue;
  changelog: Changelog;
}

