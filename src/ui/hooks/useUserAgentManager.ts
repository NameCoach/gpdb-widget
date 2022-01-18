import IUserAgentManager from "../../types/user-agent-manager";
import UserAgentManager from "../../core/userAgentManager";

export default function useUserAgentManager(): IUserAgentManager {
  return new UserAgentManager();
}
