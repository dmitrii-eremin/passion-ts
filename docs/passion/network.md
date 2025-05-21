# INetwork — Networking API Reference

The `INetwork` interface provides a simple, robust, and type-safe way to add real-time networking to your Passion games. This subsystem enables multiplayer, online features, and communication with remote servers using WebSockets, all with minimal setup and maximum flexibility.

---

## Overview

Networking in Passion is event-driven and easy to use. You can connect to any WebSocket server, send and receive messages, and handle connection events through a single callback. Each connection is managed by a unique socket index, allowing you to handle multiple simultaneous connections if needed.

---

## API Reference

### Types

#### `SocketResponseType`
```typescript
type SocketResponseType = 'connected' | 'disconnected' | 'error' | 'message';
```
Represents the type of event received from the WebSocket connection.

#### `OnServerResponse`
```typescript
type OnServerResponse = (
    socketIndex: WebSocketIndex,
    responseType: SocketResponseType,
    data?: any
) => void;
```
A callback function that handles all events from the server. Receives the socket index, event type, and optional data.

---

### Interface: `INetwork`

#### `connect(address: string, responseCallback: OnServerResponse): WebSocketIndex`
Establishes a new WebSocket connection to the specified address. All events (connect, disconnect, error, message) are delivered to your callback, along with the socket index and any received data.

- **address**: `string` — The WebSocket server URL (e.g., `ws://localhost:8080`).
- **responseCallback**: `OnServerResponse` — Function called on connection events.
- **returns**: `WebSocketIndex` — A unique index for this connection.

#### `close(socket: WebSocketIndex): void`
Closes the specified WebSocket connection and removes it from the engine's management.

- **socket**: `WebSocketIndex` — The index of the socket to close.
- **returns**: `void`

#### `send(socket: WebSocketIndex, data: string | Object): boolean`
Sends a message to the server over the specified socket. If an object is provided, it is automatically serialized to JSON.

- **socket**: `WebSocketIndex` — The index of the socket to send data through.
- **data**: `string | Object` — The message to send. Objects are serialized to JSON.
- **returns**: `boolean` — `true` if the message was sent successfully, `false` otherwise.

---

## Event Types

The callback passed to `connect` receives the following event types:
- `'connected'`: The socket has successfully connected.
- `'disconnected'`: The socket has closed or lost connection.
- `'error'`: An error occurred (see `data` for details).
- `'message'`: A message was received from the server (see `data`).

---

## Example Usage

### Connecting to a WebSocket Server
```typescript
const socket: WebSocketIndex = passion.network.connect(
    'ws://localhost:8080',
    (id: WebSocketIndex, type: SocketResponseType, data?: any): void => {
        if (type === 'connected') {
            console.log('Connected!');
        } else if (type === 'message') {
            console.log('Received:', data);
        } else if (type === 'error') {
            console.error('Error:', data);
        } else if (type === 'disconnected') {
            console.log('Disconnected.');
        }
    }
);
```

### Sending a Message
```typescript
const success: boolean = passion.network.send(socket, { action: 'ping' });
```

### Closing a Connection
```typescript
passion.network.close(socket);
```

---

## Design Philosophy

- **Simplicity**: One callback handles all events for a connection.
- **Flexibility**: Supports multiple simultaneous connections.
- **Type-Safe**: Uses TypeScript types for socket indices and event data.
- **Automatic Serialization**: Objects are sent as JSON automatically.

---

For more advanced networking, you can manage multiple sockets, send structured data, and handle errors gracefully. See the [Passion engine documentation](./passion.md) for more details and best practices.
