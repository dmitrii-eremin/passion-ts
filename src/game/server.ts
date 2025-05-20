import { WebSocketServer } from 'ws';

export type CommandType = 'login' | 'set_pos' | 'update';

export type Command = {
    type: CommandType;
};

export type CommandLogin = Command & {
    username: string;
};

export type CommandSetPos = Command & {
    x: number;
    y: number;
};

export class ObjectData {
    name: string = '';
    x: number = 0;
    y: number = 0;
}

export type CommandUpdate = Command & {
    objects: ObjectData[];
};

const activePlayers: Map<WebSocket, ObjectData> = new Map<WebSocket, ObjectData>();

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', ws => {
    activePlayers.set(ws, new ObjectData());

    ws.on('message', (data: string) => {
        const message = JSON.parse(data.toString()) as Command;

        console.log('Received:', data.toString(), message);
        if (activePlayers.has(ws)) {
            if (message.type === 'login') {
                const cmd: CommandLogin = message as CommandLogin;
                console.log(`Registered player: "${cmd.username}"`)
                activePlayers.get(ws)!.name = cmd.username;
            }
            else if (message.type === 'set_pos') {
                const cmd: CommandSetPos = message as CommandSetPos;
                activePlayers.get(ws)!.x = cmd.x;
                activePlayers.get(ws)!.y = cmd.y;
                console.log(`Player ${activePlayers.get(ws)!.name} changed pos: "${cmd.x}, ${cmd.y}"`)
            }
        }

        wss.clients.forEach((client: WebSocket) => {
            if (client.readyState === ws.OPEN) {
                const data: CommandUpdate = {
                    type: 'update',
                    objects: Array.from(activePlayers.values())
                };
                client.send(JSON.stringify(data));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server running on ws://localhost:8080');