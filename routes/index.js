let express = require('express');
let router = express.Router();
const nodemailer = require('nodemailer')
let emailCheck = require('email-check');
const EmailValidator = require('email-deep-validator');
let verifier = require('email-verify');
let fs = require('fs')
let neek = require('neek');
let toJSON = require('plain-text-data-to-json')
const dns = require('dns');
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("HEllo")
    const emailValidator = new EmailValidator();
    let infoCodes = verifier.infoCodes;
    let count = 0;
    let readable = 'gym-bangladesh.txt';
    let writable = 'output.txt';
    neek.unique(readable, writable, async result => {
        let doc = fs.readFileSync('output.txt', 'utf8')

        let data = toJSON(doc)
        console.log(data.length);

        for (let i = 0; i < data.length; i++) {
            const {wellFormed, validDomain, validMailbox} = await emailValidator.verify(data[i]);
            console.log(wellFormed, validDomain, validMailbox);

            console.log(data[i], ': ', result);
            console.log(result)
            if (wellFormed && validDomain) {
                count++;
                fs.appendFileSync('email.txt', data[i] + '\n')
                const transporter = nodemailer.createTransport({
                    service: 'yandex',
                    auth: {
                        user: 'official@consoleit.io',
                        pass: 'console_it_123123'
                    },
                    tls: {
                        // do not fail on invalid certs
                        rejectUnauthorized: false
                    }
                });


                const mailOptions = {
                    from: 'official@consoleit.io',
                    text: "Hello All",
                    to: data[i],
                    subject: "Test Sub",
                    dsn: {
                        id: 'some random message specific id',
                        return: 'headers',
                        notify: ['failure', 'delay'],
                        recipient: 'sender@example.com'
                    }
                };

                const mailInfo = await transporter.sendMail(mailOptions)
                console.log(mailInfo);
            }


            console.log(count)
        }


    });
    res.json({
        msg: "Done"
    })
});

module.exports = router;
