import React from "react";
import PatientRegImage from "../../assets/images/registration.webp";
import AppointmentImage from "../../assets/images/appointment.jpg";
import BillingImage from "../../assets/images/billing.jpg";

const HowItWorks = () => {
  const howItWorksData = [
    {
      id: 1,
      img: PatientRegImage,
      title: "Patient Registration",
      des: "Easily register new patients and maintain their medical history securely in our system.",
    },
    {
      id: 2,
      img: AppointmentImage,
      title: "Appointment Scheduling",
      des: "Schedule patient appointments efficiently with reminders for doctors and patients.",
    },
    {
      id: 3,
      img: BillingImage,
      title: "Billing & Payments",
      des: "Streamline billing and payment processes with integrated insurance claims management.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h4 className="text-gray-600 text-lg font-semibold">HOW IT WORKS</h4>
          <h2 className="text-4xl font-bold mb-4">
            Streamline Your <span className="text-blue-600">Hospital</span>{" "}
            <br />
            Management Process
          </h2>
          <p className="text-gray-500">
            Our system is designed to make hospital operations faster and more
            efficient, ensuring better care and streamlined management.
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {howItWorksData.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-lg p-6">
              {/* Image */}
              <img
                src={item.img}
                className="w-full h-48 object-cover rounded-lg mb-4"
                alt={item.title}
              />
              {/* Step Number */}
              <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-white font-bold text-xl mb-4">
                {item.id}
              </div>
              {/* Title */}
              <h5 className="text-center text-2xl font-semibold mb-2">
                {item.title}
              </h5>
              {/* Description */}
              <p className="text-gray-500 text-center">{item.des}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
