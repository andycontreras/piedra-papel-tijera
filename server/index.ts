import * as express from 'express';
import * as cors from 'cors';
import path from 'path';

const app = express();
const port = process.env.port || 3005;
app.use(path.join(__dirname, '../dist'));
app.use(cors());
app.use(express.json());

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
	console.log(`App listen at http://localhost:${port}`);
});
