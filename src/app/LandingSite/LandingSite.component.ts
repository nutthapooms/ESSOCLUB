import { Component, OnInit, HostListener, NgModule } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { delay } from 'q';
import { DataService } from '../data.service';

// import { getUserFunction } from '../shared/getUser.component';
@Component({
    selector: 'Landing-Site',
    templateUrl: './LandingSite.component.html',
    styleUrls: ['./LandingSite.component.css']
})

export class LandingSiteComponent implements OnInit {
    constructor(
        private http: HttpClient,
        private routing: Router,
        private location: Location,
        private data: DataService
        // private userFx: getUserFunction,
    ) {

    }
    Committees: any[] = []

    url = this.data.dataUrl;
    listReqURL = "_vti_bin/ListData.svc/"
    adminCheck = false
    imagePath = this.data.dataUrl + "Picture%20Hub/ESSOCLUB.png"

    loading: boolean = false
    vision = ""
    objective = ""
    scrollDown(){
        window.scroll(0,1920);
    }
    navigateClubs(){
        this.routing.navigate(['Events'])
    }
    getBoothDetail() {
        // this.loading = true
        this.Committees = []

        this.http.get<any>(this.url + this.listReqURL + "CommitteesDetails", {
            responseType: 'json'
            , withCredentials: true
        }).subscribe(data => {
            this.loading = false

            for (let index in data.d.results) {

                    this.Committees.push({ value: data.d.results[index], PictureUrl: this.url + "Picture%20Hub/" + data.d.results[index].Picture});
                    
            };
        })
        this.http.get<any>(this.url + this.listReqURL + "WebDetails", {
            responseType: 'json'
            , withCredentials: true
        }).subscribe(data => {
            this.loading = false
            this.vision = data.d.results[0].Desc
            this.objective = data.d.results[1].Desc
            
        })
    }
    

    ngOnInit() {
        // this.getBoothDetail(false)
        this.getBoothDetail()
        
    }
    currentLocation() {
        return this.location.path()
    }

}

