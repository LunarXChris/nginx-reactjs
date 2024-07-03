const fs = require('fs');
const https = require('https');
const axios = require('axios')
// const Buffer = require('buffer').Buffer

// const req = https.request(
//   {
//     hostname: 'localhost',
//     port: 8001,
//     path: '/showall',
//     method: 'GET',
//     cert: fs.readFileSync('client.pem'),
//     key: fs.readFileSync('client-key.pem'),
//     ca: fs.readFileSync('ca.pem')
//   },
//   res => {
//     res.on('data', function(data) {
//       // do something with response
//       const base64Data = data.toString('base64');

//       // Create a JSON object with the Base64-encoded data
//       const json = { data: base64Data };
      
//       // Convert the JSON object to a string
//       const jsonString = JSON.stringify(json);
      
//       console.log(jsonString);
//     });
//   }
// );

// req.end();

const client_key = "-----BEGIN EC PRIVATE KEY-----\n\
MHcCAQEEIMwujpFCKgGnLq0sl9eqXL80w4xY4z8wFpeS2B53DbEqoAoGCCqGSM49\n\
AwEHoUQDQgAE8BzRCdZJ7xA2UcfMgcMILIzlhM26tB31RxMdYoSiNeECYzeETJdE\n\
ktwc7anFl7wx2IKx6j7zYGV8CiPUl3Rlzw==\n\
-----END EC PRIVATE KEY-----\n"

const client_cert = "-----BEGIN CERTIFICATE-----\n\
MIICzTCCAbWgAwIBAgIUA5WS02lMeHRwH30LvEVBZUSmFE0wDQYJKoZIhvcNAQEL\n\
BQAwWTEOMAwGA1UEBhMFQ2hpbmExCzAJBgNVBAgTAkhLMQswCQYDVQQHEwJISzEO\n\
MAwGA1UEChMFbmdpbngxDzANBgNVBAsTBlN5c3RlbTEMMAoGA1UEAxMDV2ViMB4X\n\
DTI0MDYyOTE0MTkwMFoXDTI1MDYyOTE0MTkwMFowFDESMBAGA1UEAxMJbG9jYWxo\n\
b3N0MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE8BzRCdZJ7xA2UcfMgcMILIzl\n\
hM26tB31RxMdYoSiNeECYzeETJdEktwc7anFl7wx2IKx6j7zYGV8CiPUl3Rlz6OB\n\
nDCBmTAOBgNVHQ8BAf8EBAMCBaAwHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUF\n\
BwMCMAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFAtiQi3jBeEXtf/jn2uBRxMkk3He\n\
MB8GA1UdIwQYMBaAFMYotKahqVwJrCB3Txelyr0OMwN8MBoGA1UdEQQTMBGCCWxv\n\
Y2FsaG9zdIcEfwAAATANBgkqhkiG9w0BAQsFAAOCAQEAPtZCOQKOP2nvHPPDwxGN\n\
YpCAlaR0LmQSozZLT0tLTmuacGriqKXh3Rerp9jJ0vH7HyeNaoR+Git1sPSoT5Pj\n\
jczh4dU+IB04B37fHKNVfD1VSgYD/krafxX5ZNSAkmtv4NmhNO032fQbmnxr646X\n\
EmC2nli6PD1wmKL9DnqDzdbKPafN2NpF1fkRPv4nydGpx4Yr8mzW0/iiHNqtCaNI\n\
ZUbN4zKvI5ctxo321SzFQpS0/io1IdjAVVZ7lnDFO7gVISqtkxpuyAf1LXr+WtNO\n\
TML73NdH0mJCCD4YNqJsADqKAcpRAnn7RqC9a52u8WQvQORgt5/l2o+clkM+ZYuD\n\
HQ==\n\
-----END CERTIFICATE-----\n"

const ca = "-----BEGIN CERTIFICATE-----\n\
MIIDgjCCAmqgAwIBAgIUTtQSCzgvMXTWlFBbd3YqtiN1IsgwDQYJKoZIhvcNAQEL\n\
BQAwWTEOMAwGA1UEBhMFQ2hpbmExCzAJBgNVBAgTAkhLMQswCQYDVQQHEwJISzEO\n\
MAwGA1UEChMFbmdpbngxDzANBgNVBAsTBlN5c3RlbTEMMAoGA1UEAxMDV2ViMB4X\n\
DTI0MDYyOTE0MTQwMFoXDTI5MDYyODE0MTQwMFowWTEOMAwGA1UEBhMFQ2hpbmEx\n\
CzAJBgNVBAgTAkhLMQswCQYDVQQHEwJISzEOMAwGA1UEChMFbmdpbngxDzANBgNV\n\
BAsTBlN5c3RlbTEMMAoGA1UEAxMDV2ViMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A\n\
MIIBCgKCAQEAvg5RqGKhiJDOhDxgKYsBgGvXuVIW/swHur7o1JvocEw/ntp7kH6f\n\
ha+Lj9DpDKJ5jqbtY5r7DNa7IHPZDx/Kbj8uPF3IImaKFpIoAbYvF6ppUdq+HKdh\n\
OPyNm1KJXeTipsgAQdXPYDDpv52+9x2uj16PLis3KUPeEXyMoNDTMxPhsTsmGMe7\n\
/sffaxUgmeXgRtV6aJUJFAM8fL5yDicU6HMKAHl8NTBbPuX42sMXwIGtsqkbdww7\n\
F/uk0G98BDeFwgUHEZZg3X9VOkXo923IQhZYZK+PdhguvfnlPDhDxPeNUvib1aE5\n\
SmKh8YvSK4vbVCalBXQh7/7JSuqP8w4n2QIDAQABo0IwQDAOBgNVHQ8BAf8EBAMC\n\
AQYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUxii0pqGpXAmsIHdPF6XKvQ4z\n\
A3wwDQYJKoZIhvcNAQELBQADggEBABiOjoZhw9yPe67DeO0NHLpDNmR0UY0Xtgp2\n\
8hNkuaFkRBe7xMBCndKmlDpZhH9wJELFFSBjGYruVOcDPYdmNP4inbwcoPvQHHUT\n\
GjhJOmpGosfKQQhWxwKc6tsxJnA71aabsht6diSzK2BKuyZlLPZJKR3ZT6qG91VY\n\
s9u/vhtRCEgC93Z18YE2Hxr0Do2Z7Bm45w8Ohd4IMesJq5R9zMa9mo7EesRT7zfa\n\
yAjgRjEqsuB8CCKo+BTuRP+I/5q6jAOVIjXcHMz1T0EH7/8D4+IOIQnGToM0Jx9E\n\
uGH7Gg92oul8f0+rKY+m3d/ct9r2NrEjUYJR47NIkIt3kDEm4ec=\n\
-----END CERTIFICATE-----\n"

console.log(fs.readFileSync('client.pem').toString().split())

// const httpsAgent = new https.Agent({
//     // rejectUnauthorized: false,
//     cert: fs.readFileSync('client.pem').toString(),
//     key: fs.readFileSync('client-key.pem').toString(),
//     ca: fs.readFileSync('ca.pem').toString()
//   });
  const httpsAgent = new https.Agent({
    // rejectUnauthorized: false,
    cert: client_cert,
    key: client_key,
    ca: ca
  });
  console.log(client_cert)
  console.log(fs.readFileSync('client.pem').toString() === client_cert)

  axios.get('https://localhost:8001/showall', {httpsAgent}).then ((response) => {
    console.log(response.data)
  }
  )

