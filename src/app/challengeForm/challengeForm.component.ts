import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
    selector: 'challenge-Form',
    templateUrl: './challengeForm.component.html',
    styleUrls: ['./challengeForm.component.css']
})
export class ChallengeFormComponent implements OnInit {

    constructor(
        private http: HttpClient,
        private data: DataService,
        private routing: Router
    ) { }
    eventDetail = { Title: "", Description: "", EventCode: "", Score: "", RegisterLink: "", Active: "Enable", CodeLimit: 0, Picture: "defaultEvent.png" }

    url = this.data.dataUrl;
    listReqURL = "_vti_bin/ListData.svc/"

    submit() {
        let eventCode = (<HTMLInputElement>document.getElementById('eventCode')).value
        this.eventDetail.Title = (<HTMLInputElement>document.getElementById('eventName')).value
        this.eventDetail.Description = (<HTMLInputElement>document.getElementById('eventDescription')).value
        this.eventDetail.EventCode = (<HTMLInputElement>document.getElementById('eventCode')).value
        this.eventDetail.Score = (<HTMLInputElement>document.getElementById('codeEarning')).value
        this.eventDetail.RegisterLink = (<HTMLInputElement>document.getElementById('eventUrl')).value
        this.eventDetail.CodeLimit = parseInt((<HTMLInputElement>document.getElementById('codeLimit')).value)

        this.http.get<any>(this.url + this.listReqURL + "ChallengesDetail" + "/?$filter=(EventCode eq '" + eventCode + "')"
            , { withCredentials: true }
        ).subscribe(dataCode => {
            if (dataCode.d.results.length == 0) {
                this.http.post(this.url + this.listReqURL + "ChallengesDetail",
                    JSON.stringify(this.eventDetail)
                    , { withCredentials: true }
                ).subscribe(data1 => {
                    alert("Submit successful")
                    this.routing.navigate(['/Landing-site'])
                    
                    // window.location.replace(this.data.urlLocation)
                })
            }
            else {
                alert("Duplicate error")
            }
        })


    }

    return() {
        this.routing.navigate(['/Landing-site'])

    }
    ngOnInit() {


    }

}