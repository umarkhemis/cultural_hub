
export type NotificationItem = {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  related_entity_id?: string | null;
  is_read: boolean;
  created_at: string;
};