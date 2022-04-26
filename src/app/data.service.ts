import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DataService {
    public dataUrl = 'https://ishareteam1.na.xom.com/sites/BKKBSCERGO/BKKESSOCLUB/'

    // public urlLocation = 'http://localhost:4200';
    public urlLocation = 'https://ishareteam1.na.xom.com/sites/BKKBSCERGO/BKKESSOCLUB/developmentSite/index.html';

    private returnLocation = new BehaviorSubject('/Landing-site');
    currentReturnLocation = this.returnLocation.asObservable();

    private UserName = new BehaviorSubject({});
    currentUserName = this.UserName.asObservable();

    private UserScore = new BehaviorSubject([{value:{Score:0}}]);
    currentUserScore = this.UserScore.asObservable();

    private LeaderBoard = new BehaviorSubject([""]);
    currentLeaderBoard = this.LeaderBoard.asObservable();

    private langSource = new BehaviorSubject('eng');
    currentLanguage = this.langSource.asObservable();

    private myRank = new BehaviorSubject(-1);
    currentMyRank = this.myRank.asObservable();

    private myTransaction = new BehaviorSubject([""]);
    currentMyTransaction = this.myTransaction.asObservable();

    private myTransactionHistory = new BehaviorSubject([""]);
    currentMyTransactionHistory = this.myTransactionHistory.asObservable();

    private tempTransaction = new BehaviorSubject([""]);
    currenttempTransaction = this.tempTransaction.asObservable();

    private challengeDetail = new BehaviorSubject({});
    currentChallengeDetail = this.challengeDetail.asObservable();

    constructor(
        private http: HttpClient
    ) { }
    changeMyRank(message : number) {
        this.myRank.next(message)
    }

    changeChallengeDetail(message : any){
        this.challengeDetail.next(message)
    }
    changeTempTransaction(message : any[]){
        this.tempTransaction.next(message)
    }

    changeMyTransaction(message: any[]){
        this.myTransaction.next(message);
    }
    changeMyTransactionHistory(message: any[]){
        this.myTransactionHistory.next(message);
    }

    changeUser(message: string) {
        this.UserName.next(message);
    }
    changeUserScore(message: any[]) {
        this.UserScore.next(message);
    }
    changeLanguage(message: string) {
        this.langSource.next(message);
    }
    changeLeaderBoard(message: any[]) {
        this.LeaderBoard.next(message);
    }
    changeReturnLocation(message: string) {
        this.returnLocation.next(message);
    }

}


