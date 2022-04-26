import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpHandler, HttpRequest } from '@angular/common/http';
import { DataService } from 'src/app/data.service'
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private data: DataService,
    private routing: Router

  ) {
    this.routing.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        // this.getLeaderBaord()
        this.getUser()
        this.getUserScore()
        // this.getUser()
        // this.getLeaderBaord()
        // this.getUserTransaction()
        // this.getUserTransaction()
      }
    });
  }

  url = this.data.dataUrl;
  imagePath = this.data.dataUrl + "Picture%20Hub/Esso%20Club%20logo-White.png"
  listReqURL = "_vti_bin/ListData.svc/"
  transactionInfo = { EventOrPrice: "", Operation: "" }
  leaderBoard: any[] = []
  Challenges: any[] = []
  userProfile: any = {}
  userScore: any = []


  getUser() {
    this.http.get<any>(this.url + "_api/sp.userprofiles.peoplemanager/getmyproperties", {
      responseType: 'json'
      , withCredentials: true
    }).subscribe(data => {
      // console.log(data.d)
      this.data.changeUser(data.d); //update userprofile
      this.userProfile = data.d;
      if (this.userProfile.PictureUrl != null) {
        (<HTMLInputElement>document.getElementById('ProfileImage')).src = data.d.PictureUrl;
      }
      else {
        (<HTMLInputElement>document.getElementById('ProfileImage')).src = this.data.dataUrl + "Picture%20Hub/defaultProfileImage.png"

      }

    })
  }
  predicateBy(prop: string, indicator: string) {
    return function (a: any, b: any) {
      if (a[prop][indicator] > b[prop][indicator]) {
        return -1;
      } else if (a[prop][indicator] < b[prop][indicator]) {
        return 1;
      }
      return 0;
    }
  }
  contactUs(name: string) {
    alert(name)
  }
  groupby(array: any[], key: string) {
    let finalresult: any = []
    let unitArr: any = []
    let existingArr: string[] = []
    let index = 0
    array.reduce((result, currentValue) => {
      if (existingArr.find(element => element == currentValue[key]) == currentValue[key]) {
        result = currentValue
        finalresult[finalresult.findIndex((item: { [x: string]: any; EventOrPrice: any; }) => item.EventOrPrice === currentValue[key])].Unit += 1

      }
      else {
        unitArr[index] = 1

        result = currentValue
        finalresult.push({ EventOrPrice: currentValue[key], Unit: 1 })
        existingArr.push(currentValue[key])
        index += 1
      }
      return result
    }, {});

    return finalresult
  };
  closeHowTo() {
    <HTMLInputElement><unknown>document.getElementById('HowToModal')?.classList.add("em-is-closed")
  }
  openHowTo() {
    <HTMLInputElement><unknown>document.getElementById('HowToModal')?.classList.remove("em-is-closed")
  }
  getUserTransaction() {
    this.http.get<any>(this.url + "_api/sp.userprofiles.peoplemanager/getmyproperties", {
      responseType: 'json', withCredentials: true
    }).subscribe(data1 => {
      this.http.get<any>(this.url + this.listReqURL + "Transaction" + "/?$filter=(CreatedBy/WorkEmail eq '" + data1.d.Email + "' and EventOrPrice ne 'create user')", {
        responseType: 'json'
        // , withCredentials: true
      }).subscribe(data => {
        let keys: any[] = [];
        let keys2: any[] = [];

        for (let key in data.d.results) {
          let CreateDate = data.d.results[key].Created.replace('/Date(', '')
          data.d.results[key].Created = new Date(parseInt(CreateDate.replace(')/', ''))).toString()
          if (data.d.results[key].Operation == 'reduction') {
            keys.push(data.d.results[key])

          }
          if (data.d.results[key].Operation == 'earn') {
            keys2.push(data.d.results[key])
          }
        }
        this.data.changeMyTransactionHistory(keys2);
        let transactionGroupbyItem = this.groupby(keys, 'EventOrPrice')
        this.data.changeMyTransaction(transactionGroupbyItem); //update Transaction
      })
    })
  }

  getUserScore() {

    this.http.get<any>(this.url + "_api/sp.userprofiles.peoplemanager/getmyproperties", {
      responseType: 'json', withCredentials: true
    }).subscribe(data1 => {
      this.http.get<any>(this.url + this.listReqURL + "ContactDetails" + "/?$filter=(Name eq '" + data1.d.DisplayName + "')", {
        responseType: 'json'
        // , withCredentials: true
      }).subscribe(data => {
        if (data.d.results.length > 0) {

          let keys: { value: any; creator2: string; }[] = [];

          for (let key in data.d.results) {
            // this.http.get<any>(this.url + "_api/web/getuserbyid(" + data.d.results[key].CreatedById + ")", {
            //   responseType: 'json', withCredentials: true
            // }).subscribe(data2 => {
              keys.push({ value: data.d.results[key], creator2: data1.d.DisplayName});
              

              // keys.sort(this.predicateBy("value", "Score"))
            // })
          }


          this.data.changeUserScore(keys); //update leaderboard
          this.userScore = keys

        }
        else {
          this.http.get<any>(this.url + this.listReqURL + "Transaction" + "/?$filter=(CreatedBy/WorkEmail eq '" + data1.d.Email + "' and EventOrPrice eq 'create user')", {
            responseType: 'json'
            // , withCredentials: true
          }).subscribe(data =>{
            if (data.d.results.length < 1) {
              this.transactionInfo.EventOrPrice = "create user"
              this.transactionInfo.Operation = "Create"
              this.http.post(this.url + this.listReqURL + "Transaction",
                JSON.stringify(this.transactionInfo)
                , { withCredentials: true }
              ).subscribe(data1 => {
                alert("Creating an account profile for you. This might take 1-2 minutes.")
                setTimeout(() => {
                  window.location.replace(this.data.urlLocation)
                }, 5000)
  
              })
            }
            else {
              alert("This is your first time on VCoin. Welcome!")
            }
          }

          )
          

        }
      })
    })
  }
  getLeaderBaord() {
    let keys: { value: any; creator2: string; }[] = [];
    let indexer = []
    this.http.get<any>(this.url + this.listReqURL + "ContactDetails", {
      responseType: 'json', withCredentials: true
    }).subscribe(data => {
      this.getUser()
      let index = 0
      for (let key in data.d.results) {

        this.http.get<any>(this.url + "_api/web/getuserbyid(" + data.d.results[key].CreatedById + ")", {
          responseType: 'json'
          , withCredentials: true
        }).subscribe(data2 => {
          keys.push({ value: data.d.results[key], creator2: data2.d.Title })
          keys.sort(this.predicateBy("value", "Score"))

          if (parseInt(key) + 1 == data.d.results.length) {
            this.data.changeMyRank(keys.findIndex(item => item.value.Name === this.userProfile.DisplayName))
            this.data.changeLeaderBoard(keys)
          }

          // let myrank = keys.findIndex(item => item.value.Name === this.userProfile.DisplayName)
        })

      }
    })
  }


  ngOnInit() {
    // this.getUser()
    // this.getLeaderBaord()
    // this.getUserScore()
    // this.getUserTransaction()
  }

}