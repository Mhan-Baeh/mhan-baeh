export interface fileUpload {
  content_type: string;
  error: string;
  file: string; 
  filename: string;
  message: string;
  path: string;
  size: number;
  status: boolean;
  url: string;

}

export interface BaseResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export interface Pagination<T> {
  total: number;
  offset: number;
  limit: number;
  items: T[];
}

export interface BaseModel {
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string;
  deleted_by: string;
}

export interface VideoMetadata {
  video_url: string;
  video_duration: number;
  video_width: number;
  video_height: number;
}
