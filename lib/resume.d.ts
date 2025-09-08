export interface Education {
  degree?: string;
  universityName?: string;
  major?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Experience {
  title?: string;
  companyName?: string;
  city?: string;
  state?: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
  worksummary?: string;
}

export interface Skill {
  name?: string;
  rating?: number;
}

export interface Project {
  title: string;
  description?: string;
}

export interface Resume {
  _id?: string;
  userClerkId: string;
  title?: string;
  fullName?: string;
  email?: string;
  jobTitle?: string;
  phone?: string;
  address?: string;
  themeColor?: string;
  summary?: string;
  education?: Education[];
  experience?: Experience[];
  skills?: Skill[];
  projects?: Project[];
  createdAt?: string;
  updatedAt?: string;
}
