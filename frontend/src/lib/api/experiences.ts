
import { apiClient } from "./client";
import type { ApiSuccessResponse } from "@/src/types/api";
import type { Experience } from "@/src/types/experience";

export type ExperienceComment = {
  id: string;
  comment_text: string;
  created_at: string;
  author: {
    id: string;
    full_name: string;
    profile_image_url?: string | null;
  };
};

type PublicFeedResponse = {
  items: Experience[];
  next_cursor: string | null;
};

type CommentsResponse = {
  items: ExperienceComment[];
};

type ProviderExperiencePayload = {
  caption: string;
  location?: string;
  media_items: Array<{
    media_url: string;
    media_type: "image" | "video";
    thumbnail_url?: string;
    media_order: number;
  }>;
};

export async function getPublicFeed(cursor?: string | null, limit = 20) {
  const response = await apiClient.get<ApiSuccessResponse<PublicFeedResponse>>(
    "/experiences/public-feed",
    {
      params: {
        cursor: cursor || undefined,
        limit,
      },
    }
  );

  return response.data;
}

export async function getExperienceDetail(experienceId: string) {
  const response = await apiClient.get<ApiSuccessResponse<Experience>>(
    `/experiences/${experienceId}`
  );
  return response.data;
}

export async function likeExperience(experienceId: string) {
  const response = await apiClient.post<
    ApiSuccessResponse<{ experience_id: string }>
  >(`/experiences/${experienceId}/like`);
  return response.data;
}

export async function unlikeExperience(experienceId: string) {
  const response = await apiClient.delete<
    ApiSuccessResponse<{ experience_id: string }>
  >(`/experiences/${experienceId}/like`);
  return response.data;
}

export async function getExperienceComments(
  experienceId: string,
  limit = 20
) {
  const response = await apiClient.get<ApiSuccessResponse<CommentsResponse>>(
    `/experiences/${experienceId}/comments`,
    {
      params: { limit },
    }
  );
  return response.data;
}

export async function createExperienceComment(
  experienceId: string,
  payload: { comment_text: string }
) {
  const response = await apiClient.post<ApiSuccessResponse<ExperienceComment>>(
    `/experiences/${experienceId}/comments`,
    payload
  );
  return response.data;
}

export async function createExperience(payload: ProviderExperiencePayload) {
  const response = await apiClient.post<ApiSuccessResponse<Experience>>(
    "/experiences",
    payload
  );
  return response.data;
}
























// // import { apiClient } from "./client";
// import { apiClient } from "./client";
// import type { ApiSuccessResponse } from "@/src/types/api";
// import type { Experience } from "@/src/types/experience";

// export type ExperienceComment = {
//   id: string;
//   comment_text: string;
//   created_at: string;
//   author: {
//     id: string;
//     full_name: string;
//     profile_image_url?: string | null;
//   };
// };

// type PublicFeedResponse = {
//   items: Experience[];
//   next_cursor: string | null;
// };

// type CommentsResponse = {
//   items: ExperienceComment[];
// };

// export async function getPublicFeed(cursor?: string | null, limit = 20) {
//   const response = await apiClient.get<ApiSuccessResponse<PublicFeedResponse>>(
//     "/experiences/public-feed",
//     {
//       params: {
//         cursor: cursor || undefined,
//         limit,
//       },
//     }
//   );

//   return response.data;
// }

// export async function getExperienceDetail(experienceId: string) {
//   const response = await apiClient.get<ApiSuccessResponse<Experience>>(
//     `/experiences/${experienceId}`
//   );
//   return response.data;
// }

// export async function likeExperience(experienceId: string) {
//   const response = await apiClient.post<
//     ApiSuccessResponse<{ experience_id: string }>
//   >(`/experiences/${experienceId}/like`);
//   return response.data;
// }

// export async function unlikeExperience(experienceId: string) {
//   const response = await apiClient.delete<
//     ApiSuccessResponse<{ experience_id: string }>
//   >(`/experiences/${experienceId}/like`);
//   return response.data;
// }

// export async function getExperienceComments(
//   experienceId: string,
//   limit = 20
// ) {
//   const response = await apiClient.get<ApiSuccessResponse<CommentsResponse>>(
//     `/experiences/${experienceId}/comments`,
//     {
//       params: { limit },
//     }
//   );
//   return response.data;
// }

// export async function createExperienceComment(
//   experienceId: string,
//   payload: { comment_text: string }
// ) {
//   const response = await apiClient.post<ApiSuccessResponse<ExperienceComment>>(
//     `/experiences/${experienceId}/comments`,
//     payload
//   );
//   return response.data;
// }