import { DescriptionJson } from "interfaces/product";

export type StatusEnum = "DONE" | "IN_PROGRESS" | "IN_QUEUE" | "ERROR";

export interface formDataType {
  result: {
    title: string;
    product_uuids: string[];
  };
  video: {
    video_url: string;
    video_duration: number;
    video_width: number;
    video_height: number;
  };
}

export interface DetectionScore {
  product_uuid: string;
  product_name: string;
  screen_time: number;
  avg_confidence: number;
}

export interface AudioScore {
  product_uuid: string;
  product_name: string;
  score: number;
  calc: string;
  missing: DescriptionJson[];
  gpt_token_used: number;
  gpt_cost_used: number;
}
export interface ResultShowDataType {
  result_uuid: string;
  title: string;
  product_uuids: string[];
  product_name_en: string[];
  product_name_th: string[];
  video_uuid: string;
  video_url: string;
  detection_status: StatusEnum;
  audio_status:   StatusEnum;
  detection_score: DetectionScore[];
  detection_fps: number;
  detection_result_video_url: string;
  audio_score: AudioScore[];
  detection_error_log: string;
  audio_error_log: string;
  audio_gpt_total_token_used: number;
  audio_gpt_total_cost: number;
}
