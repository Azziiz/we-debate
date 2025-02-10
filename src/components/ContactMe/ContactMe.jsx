import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import './ContactMe.css';

function ContactMe() {
  const form = useRef();

  const request  = localStorage.getItem("request-sent")

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_vyf5q7t', // Replace with your EmailJS service ID
        'template_80x3mwh', // Replace with your EmailJS template ID
        form.current,
        'e6PD63jGMRagXj5QR' // Replace with your EmailJS public key
      )
      .then(
        (result) => {
          console.log(result.text);
          alert('Message sent successfully!');
          localStorage.setItem("request-sent", "true")
        },
        (error) => {
          console.error(error.text);
          alert('Failed to send message. Please try again.');
        }
      );



    e.target.reset(); // Reset the form after submission
  };

  return (
    <section className="contact-container" id="section5">
      <h2>Join us</h2>
      {request !== true ? 
      <form ref={form} onSubmit={sendEmail} className="contact-form">
      <input
        type="text"
        id="from_name"
        name="from_name"
        placeholder="Full Name*"
        required
      />

      <input
        type="email"
        id="reply_to"
        name="reply_to"
        placeholder="Email*"
        required
      />

      <textarea
        id="message"
        name="message"
        placeholder="Why do you want to join us?*"
        rows="5"
        required
        
      ></textarea>
      <input type="number" id="age" name="age" placeholder="Your Age" min="1" max="120" required></input>
      <select id="source" name="source" >
        <option value="didn't answer" disabled selected hidden>How did you hear about us? (optional)</option>
        <option value="social_media">Social Media</option>
        <option value="friend">A Friend</option>
        <option value="event">Event</option>
        <option value="other">Other</option>
      </select>

      <button type="submit" className="contact-submit">
        Send 
      </button>
      </form>
      :
      <div className='after-request'>
        <h3>your request have been sent</h3>
        <h4>Thank you for your interest in joining our English Debating Club! We’ll review your request and email you soon. We value commitment and teamwork and look forward to having you on board!</h4>
      </div>
      }
      

    </section>
  );
}

export default ContactMe;

