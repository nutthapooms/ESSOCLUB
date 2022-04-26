import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService} from '../data.service'
@Component({
  selector: 'my-room',
  templateUrl: './myRoom.component.html',
  styleUrls: ['./myRoom.component.css']
})
export class MyRoomComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private data: DataService
  ) { }

  url = this.data.dataUrl;
  userProfile :any = {}
  userScore :any = []
  transactions :any = []
  transactionsHistory :any = []
  listReqURL = "_vti_bin/ListData.svc/"

  loading = true

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
  
  ngOnInit() {
    this.getUserTransaction()
    this.data.currentMyTransactionHistory.subscribe(message => this.transactionsHistory = message)
    this.data.currentMyTransaction.subscribe(message => this.transactions = message)
    this.data.currentUserScore.subscribe(message => this.userScore = message)
    this.data.currentUserName.subscribe(message => {
      this.userProfile = message;
      this.loading = false
    })

  }

}