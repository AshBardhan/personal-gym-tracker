import { User } from "@/types/entities";

export const MOCK_USER_ID = "673092a6fd2a34e8e4b91234";

const seededAt = "2024-01-01T00:00:00.000Z";

export const mockUser: User = {
  _id: MOCK_USER_ID,
  name: "Demo User",
  email: "demo@gymtracker.com",
  isAdmin: true,
  createdAt: seededAt,
  updatedAt: seededAt,
};
