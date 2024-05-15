import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: WebSocketSubject<any> | null = null;

  private socketUser$: WebSocketSubject<any> | null = null;
  private socketMinute$: WebSocketSubject<any> | null = null;
  constructor() { }

  connect(roomName: string): WebSocketSubject<any> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = webSocket({
        url: `ws://localhost:8000/ws/chat/notification_test/`
      });
      console.log('Connected to WebSocket server');
    }
    return this.socket$;
  }
  connectUser(): WebSocketSubject<any> {
    if (!this.socketUser$ || this.socketUser$.closed) {
      this.socketUser$ = webSocket({
        url: `ws://localhost:8000/ws/user-id-change/`
      });
      console.log('Connected to WebSocket user');
    }
    return this.socketUser$;
  }
 /*  connectMinute(): WebSocketSubject<any> {
    if (!this.socketMinute$ || this.socketMinute$.closed) {
      this.socketMinute$ = webSocket({
        url: `ws://localhost:8000/ws/dataminute/`
      });
      console.log('Connected to WebSocket minute');
    }
    return this.socketMinute$;
  } */
  


  close() {
    if (this.socket$) {
      this.socket$.complete();
      console.log('Disconnected from WebSocket server');
    }
  }
}

/* import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket$: WebSocketSubject<any>;

  constructor() {
    this.socket$ = new WebSocketSubject('ws://127.0.0.1:8000/ws/my-websocket/');
    console.log('socket created',this.socket$);
}

  

  sendMessage(message: any) {
    this.socket$.next(message);
  }

  getMessages() {
    return this.socket$.asObservable();
  }
}
 */