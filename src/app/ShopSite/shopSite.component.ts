import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../shared/model';
import { DataService } from '../data.service';
import { Router} from '@angular/router';


@Component({
  selector: 'shop-site',
  templateUrl: './shopSite.component.html',
  styleUrls: ['./shopSite.component.css'],
})
export class ShopSiteComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private data: DataService,
    private routing: Router

  ) { }


  club = "sport"
  url = this.data.dataUrl;
  listReqURL = "_vti_bin/ListData.svc/";
  ClubList: any[] = []

  ClubType = "Sport"

  imagePath = this.data.dataUrl + "Picture%20Hub/Boxing%20Day-pana.svg"
  coinImagePath = this.data.dataUrl + "Picture%20Hub/Vcoin_icon.svg"

  loading = true

  

  getClubsDetail() {
    this.http.get<any>(this.url + this.listReqURL + "ClubsDetail", {
      responseType: 'json', withCredentials: true
    }).subscribe(data => {
      // console.log(data.d)
      for (let index in data.d.results) {
        this.ClubList.push({ value: data.d.results[index] ,QR: this.url + "Picture%20Hub/" + data.d.results[index].QR , PictureUrl: this.url + "Picture%20Hub/" + data.d.results[index].Picture });
      }
      this.loading = false
    })
  }
  filterItemsOfClub(){
    return this.ClubList.filter(x => x.value.Type == this.ClubType);
  }
  changetoSocial(){
    this.ClubType = "Social"
  }
  changetoSport(){
    this.ClubType = "Sport"
  }
 

 

  ngOnInit() {
    this.getClubsDetail();
  }

}