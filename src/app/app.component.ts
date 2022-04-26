import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet } from '@angular/router';
import { DataService } from 'src/app/data.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ITFair2';
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData
  }
  constructor(
    private data: DataService,
    // private http: HttpClient
  ) { }
  Loading = true
  url = this.data.dataUrl;
  imagePath = this.data.dataUrl + "Picture%20Hub/Background_Buttom.svg"

  getUrl() {
    return "url('"+ this.imagePath+"')";
    // return "url('C:/Users/NSUWANW/Desktop/IT_Fair_Ver2/ITFair2_package/ITFair2/src/assets/images/Background_Buttom.svg')";

  }
  ngOnInit() {
    // setTimeout(() => { this.Loading = false }, 5000)
    
  }

}
