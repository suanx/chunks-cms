export interface ActorInfo {
  id: number;
  name: string;
  englishName?: string;
  avatar?: string;
  birthDate?: string;
  birthPlace?: string;
  height?: number;
  biography?: string;
  worksCount: number;
  createdAt: string;
}

export interface CreateActorParams {
  name: string;
  englishName?: string;
  avatar?: string;
  birthDate?: string;
  birthPlace?: string;
  height?: number;
  biography?: string;
}
