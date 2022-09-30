import IUserAgentManager from "../types/user-agent-manager";

class UserAgentManager implements IUserAgentManager {
  public readonly userAgent: string;
  public readonly isDeprecated: boolean;
  public readonly isIE: boolean;

  constructor() {
    this.userAgent = UserAgentManager.getUserAgent();
    this.isIE = UserAgentManager.checkIE();
    this.isDeprecated = this.decideDeprecated();
  }

  private decideDeprecated(): boolean {
    if (this.isIE) return true;

    return false;
  }

  private static checkIE(): boolean {
    // @ts-ignore
    return !!window.document.documentMode;
  }

  private static getUserAgent(): string {
    return navigator.userAgent;
  }
}

const userAgentManager = new UserAgentManager();

export default userAgentManager;
