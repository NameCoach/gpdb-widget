import IUserAgentManager from "../types/user-agent-manager";

export default class UserAgentManager implements IUserAgentManager {
  public readonly userAgent: string;
  public readonly isDeprecated: boolean;
  public readonly isIE: boolean;

  constructor() {
    this.userAgent = this.getUserAgent();
    this.isIE = this.checkIE();
    this.isDeprecated = this.decideDeprecated();
  }

  private decideDeprecated(): boolean {
    if (this.isIE) return true;

    return false;
  }

  private checkIE(): boolean {
    // @ts-ignore
    return !!window.document.documentMode;
  }

  private getUserAgent(): string {
    return navigator.userAgent;
  }
}
