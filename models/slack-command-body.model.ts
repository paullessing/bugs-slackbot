export interface SlackCommandBody {
  token: string; // alphanumeric
  team_id: string; // T0001
  team_domain: string; // example
  channel_id: string; // C2147483705
  channel_name: string; // test
  user_id: string; // U2147483697
  user_name: string; // Steve
  command: string; // /weather
  text: string; // 94070
  response_url: string; // https://hooks.slack.com/commands/1234/5678
}
