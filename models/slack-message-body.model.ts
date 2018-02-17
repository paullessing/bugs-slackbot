export interface SlackMessageBody {
  token: string;
  team_id: string;
  team_domain: string;
  service_id: string;
  channel_id: string;
  channel_name: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  text: string;
  bot_id?: string;
  bot_name?: string;
}
