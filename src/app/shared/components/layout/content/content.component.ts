import { Component } from "@angular/core";
import { NavService } from "../../../services/nav.service";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: "app-content",
  templateUrl: "./content.component.html",
  styleUrls: ["./content.component.scss"],
})
export class ContentComponent {

  constructor(public navServices: NavService, private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if(event.url === '/order/create'){
          this.navServices.collapseSidebar = true;
        }
      }
    })
  }

}
