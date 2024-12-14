import express from "express";
import bodyParser from "body-parser";
import nodemailer from 'nodemailer';
import env from "dotenv";


const app = express();
const port = 3000;
env.config();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json()); 

app.get("/", (req, res) => {
    res.render("index.ejs");
})




  app.get('/load-partial', (req, res) => {
    const screenSize = parseInt(req.query.screenSize, 10);
  
    if (screenSize >= 1195) {
      res.render('partials/index1.ejs', { layout: false });
    } else {
        res.render('partials/index2.ejs', { layout: false });
    }
  });


  app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;
   
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.PASSWORD
        }
    });
 


  const mailOptions = {
    from: email,
    to: 'danieldanluxurywears@gmail.com',
    subject: `Mail from ${name}`,
    text: `You have received a new message from your website contact form.\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`
};

try {
  // Send email
  const info = await transporter.sendMail(mailOptions);

  // Respond with success message
  return res.status(200).json({ message: 'Message delivered successfully!' });
} catch (error) {
  console.error('Error sending email:', error);
  return res.status(500).json({ message: 'Failed to send message. Please try again later.' });
}
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
export default app;