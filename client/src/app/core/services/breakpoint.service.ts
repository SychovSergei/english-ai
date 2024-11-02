import { Injectable } from "@angular/core";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject } from "rxjs";

export enum EBreakpoints {
  XSmall = "XSmall",
  Small = "Small",
  Medium = "Medium",
  Large = "Large",
  XLarge = "XLarge",
  Min600 = "(min-width: 600px)",
}

@Injectable({
  providedIn: "root"
})
export class BreakpointService {

  private breakpointStates: Map<string, BehaviorSubject<boolean>> = new Map<string, BehaviorSubject<boolean>>();

  constructor(private observer: BreakpointObserver) {

    const breakpoints = [
      { name: EBreakpoints.XSmall, query: Breakpoints.XSmall },
      { name: EBreakpoints.Small, query: Breakpoints.Small },
      { name: EBreakpoints.Medium, query: Breakpoints.Medium },
      { name: EBreakpoints.Large, query: Breakpoints.Large },
      { name: EBreakpoints.XLarge, query: Breakpoints.XLarge },
      { name: EBreakpoints.Min600, query: "(min-width: 600px)" },
    ];

    breakpoints.forEach((breakpoint) => {
      const subject = new BehaviorSubject<boolean>(false);
      this.breakpointStates.set(breakpoint.name, subject);

      this.observer.observe(breakpoint.query).subscribe((res) => {
        subject.next(res.matches);
      });
    });
  }

  getBreakpointState(breakpointName: EBreakpoints) {
    return this.breakpointStates.get(breakpointName)?.asObservable();
  }

}
