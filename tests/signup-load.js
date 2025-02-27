import http from 'k6/http';
import { sleep, check } from 'k6';

import uuid from './libs/uuid.js';

export const options = {
    stages: [
        { duration: '1m', target: 100 },
        { duration: '2m', target: 100 },
        { duration: '1m', target: 0 }
    ],
    thresholds: {
        http_req_duration: ['p(95)<2000'], // 95% das req's devem responder em até 2s
        http_req_failed: ['rate<0.01'] // 1% das req's podem ocorrer erro
    }
}

export default function () {
    const url = 'http://localhost:3333/signup';

    const headers = {
        headers: { 'Content-Type': 'application/json' },
    };

    const payload = JSON.stringify(
        { email: `${uuid.v4().substring(24)}@qa.qacademy.com.br`, password: '123456' },
    );

    const res = http.post(url, payload, headers);

    console.log(res.body);

    check(res, {
        'Status Code Should Be 201': (r) => r.status === 201,
    });

    sleep(1);
}
