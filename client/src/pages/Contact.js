import React from "react";
import PageTopBanner from "../components/common/PageTopBanner";
import ContactImg from "../assets/images/hosp.jpg";

const Contact = () => {
  return (
    <>
      <PageTopBanner title="Contact Us" path="/contact" />

      <section className="bg-white">
        <div className="container mx-auto p-5">
          <div className="text-center">
            <h2 className="text-3xl font-semibold mb-2">
              <span>Get in touch</span> with us
            </h2>
            <p className="text-gray-600">
              Get in touch to discuss your employee wellbeing needs today.
              Please give us a call, <br /> drop us an email, or fill out the
              contact form and we’ll get back to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
            <div className="bg-gray-100 p-5 rounded-lg shadow text-center">
              <i className="bi bi-telephone-fill text-4xl mb-2 text-blue-600"></i>
              <h5 className="text-lg font-bold">Get In Touch</h5>
              <p className="m-0">Mobile: 084 3456 19 89</p>
              <p className="m-0">Hotline: 1900 26886</p>
              <p className="m-0">E-mail: hello@printec.com</p>
            </div>
            <div className="bg-gray-100 p-5 rounded-lg shadow text-center">
              <i className="bi bi-geo-alt-fill text-4xl mb-2 text-blue-600"></i>
              <h5 className="text-lg font-bold">Address</h5>
              <p className="m-0">Head Office: 785 15h Street, Office 478</p>
              <p className="m-0">Berlin, De 81566</p>
              <p className="m-0">Check Location</p>
            </div>
            <div className="bg-gray-100 p-5 rounded-lg shadow text-center">
              <i className="bi bi-clock-fill text-4xl mb-2 text-blue-600"></i>
              <h5 className="text-lg font-bold">Hour of operation</h5>
              <p className="m-0">Monday-Friday: 8am-5pm</p>
              <p className="m-0">Saturday: 9am-Midday</p>
              <p className="m-0">Sunday: Closed</p>
            </div>
          </div>

          <div className="mt-5">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63372.81289574271!2d79.87110799156677!3d6.914403829698229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae256db1a6771c5%3A0x2c63e344ab9a7536!2sSri%20Lanka%20Institute%20of%20Information%20Technology!5e0!3m2!1sen!2slk!4v1711994370381!5m2!1sen!2slk"
              style={{ width: "100%", height: "400px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg shadow"
            ></iframe>
          </div>

          <div className="mt-10">
            <div className="text-center">
              <h2 className="text-3xl font-semibold mb-5">
                Send a <span className="text-blue-600">message</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <form>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="border border-gray-300 p-2 w-full rounded"
                      id="name"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="border border-gray-300 p-2 w-full rounded"
                      id="email"
                      placeholder="Enter your email"
                      aria-describedby="emailHelp"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="comment"
                      className="block text-gray-700 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      className="border border-gray-300 p-2 w-full rounded"
                      placeholder="Write something..."
                      id="comment"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                  >
                    Submit
                  </button>
                </form>
              </div>
              <div>
                <img
                  src={ContactImg}
                  alt="Contact"
                  className="img-fluid rounded-lg shadow ml-[5rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
