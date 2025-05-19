export class WSClient {
    private socket: WebSocket;
    private onMessageCallback?: (data: any) => void;
    private onOpenCallback?: () => void;
    private onCloseCallback?: () => void;
    private onErrorCallback?: (err: Event) => void;

    constructor(url: string) {
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            if (this.onOpenCallback) this.onOpenCallback();
        };

        this.socket.onmessage = (event) => {
            if (this.onMessageCallback) this.onMessageCallback(event.data);
        };

        this.socket.onclose = () => {
            if (this.onCloseCallback) this.onCloseCallback();
        };

        this.socket.onerror = (err) => {
            if (this.onErrorCallback) this.onErrorCallback(err);
        };
    }

    send(data: string) {
        this.socket.send(data);
    }

    onMessage(callback: (data: any) => void) {
        this.onMessageCallback = callback;
    }

    onOpen(callback: () => void) {
        this.onOpenCallback = callback;
    }

    onClose(callback: () => void) {
        this.onCloseCallback = callback;
    }

    onError(callback: (err: Event) => void) {
        this.onErrorCallback = callback;
    }

    close() {
        this.socket.close();
    }
}