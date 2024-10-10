import React from "react";
import DoctorImage1 from "../../assets/images/user1.png";
import DoctorImage2 from "../../assets/images/user2.jpeg";
import DoctorImage3 from "../../assets/images/user3.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      img: DoctorImage1,
      name: "Dr. Jane Doe",
      title: "Chief Medical Officer",
      feedback:
        "The hospital management system has revolutionized how we handle patient data and streamline our workflow, allowing us to focus more on patient care and less on paperwork.",
    },
    {
      id: 2,
      img: DoctorImage2,
      name: "Dr. John Smith",
      title: "Cardiologist",
      feedback:
        "The integrated appointment scheduling and billing system has reduced administrative errors and increased patient satisfaction by providing a seamless experience.",
    },
    {
      id: 3,
      img: DoctorImage3,
      name: "Dr. Emily Davis",
      title: "Pediatrician",
      feedback:
        "With this hospital management system, our department can easily track patient progress, improving both the quality of care and communication among the medical team.",
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h4 className="text-gray-600 text-lg font-semibold">
            CLIENT TESTIMONIALS
          </h4>
          <h2 className="text-4xl font-bold mb-4">
            Here's What Our <span className="text-blue-600">Users</span> <br />
            Say About Us
          </h2>
          <p className="text-gray-500">
            Our hospital management system is trusted by healthcare
            professionals across different specialties.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              {/* Image */}
              <img
                src={testimonial.img}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              {/* Stars */}
              <div className="flex justify-center text-yellow-500 mb-4">
                {[...Array(5)].map((star, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.682a1 1 0 00.95.69h4.912c.969 0 1.371 1.24.588 1.81l-3.974 2.89a1 1 0 00-.364 1.118l1.518 4.683c.3.921-.755 1.688-1.54 1.118l-3.974-2.89a1 1 0 00-1.176 0l-3.974 2.89c-.784.57-1.84-.197-1.54-1.118l1.518-4.683a1 1 0 00-.364-1.118L.58 10.108c-.784-.57-.38-1.81.588-1.81h4.912a1 1 0 00.95-.69l1.518-4.682z" />
                  </svg>
                ))}
              </div>
              {/* Testimonial Text */}
              <p className="text-gray-600 text-center mb-4">
                {testimonial.feedback}
              </p>
              {/* Name and Title */}
              <div className="text-center">
                <h5 className="text-xl font-bold">{testimonial.name}</h5>
                <p className="text-gray-500">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
