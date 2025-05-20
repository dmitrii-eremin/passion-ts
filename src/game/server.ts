import { WebSocketServer } from 'ws';

export type CommandType = 'login' | 'set_pos' | 'update';

export type Command = {
    type: CommandType;
};

export type CommandSetPos = Command & {
    x: number;
    y: number;
};

export type CommandLogin = Command & CommandSetPos & {
    username: string;
};

export class ObjectData {
    name: string = '';
    x: number = 0;
    y: number = 0;

    constructor(name: string = '', x: number = 0, y: number = 0) {
        this.name = name;
        this.x = x;
        this.y = y;
    }
}

export type CommandUpdate = Command & {
    objects: ObjectData[];
    cats: ObjectData[];
};

const activePlayers: Map<WebSocket, ObjectData> = new Map<WebSocket, ObjectData>();
const cats: ObjectData[] = [];

for (let i = 0; i < 25; i++) {
    cats.push(new ObjectData('kissa', Math.floor(Math.random() * 400) - 200, Math.floor(Math.random() * 400) - 200));
}

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
                activePlayers.get(ws)!.x = cmd.x;
                activePlayers.get(ws)!.y = cmd.y;
            }
            else if (message.type === 'set_pos') {
                const cmd: CommandSetPos = message as CommandSetPos;
                activePlayers.get(ws)!.x = cmd.x;
                activePlayers.get(ws)!.y = cmd.y;
                console.log(`Player ${activePlayers.get(ws)!.name} changed pos: "${cmd.x}, ${cmd.y}"`)
            }
        }

        const updateData: CommandUpdate = {
            type: 'update',
            objects: Array.from(activePlayers.values()),
            cats
        };

        console.log(`Players count: ${updateData.objects.length}`);
        wss.clients.forEach((client: WebSocket) => {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify(updateData));
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        activePlayers.delete(ws);

        const updateData: CommandUpdate = {
            type: 'update',
            objects: Array.from(activePlayers.values()),
            cats
        };
        wss.clients.forEach((client: WebSocket) => {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify(updateData));
            }
        });
    });
});

console.log('WebSocket server running on ws://localhost:8080');