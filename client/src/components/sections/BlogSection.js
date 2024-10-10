import React from "react";
import blogImage1 from "../../assets/images/blog1.jpg";
import blogImage2 from "../../assets/images/blog2.jpg";

const BlogSection = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Blog Intro Section */}
          <div className="col-span-1 mb-8 md:mb-0">
            <div className="text-left">
              <h4 className="text-gray-600 text-lg font-semibold">
                LATEST UPDATES
              </h4>
              <h2 className="text-4xl font-bold mb-4">
                Read our latest{" "}
                <span className="text-blue-600">healthcare</span> blog posts
              </h2>
              <p className="text-gray-500">
                Stay informed with the latest news, tips, and insights from the
                healthcare industry.
              </p>
              <button className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700">
                More Blogs
              </button>
            </div>
          </div>

          {/* Blog Post 1 */}
          <div className="col-span-1">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={blogImage1}
                alt="Healthcare blog 1"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <span className="text-blue-600 text-sm font-medium">
                  Healthcare Tips
                </span>
                <h5 className="mt-4 text-xl font-semibold">
                  How to Manage Your Mental Health as a Healthcare Professional
                </h5>
                <p className="mt-2 text-gray-600">
                  Discover ways to take care mental health while working in a
                  high-pressure healthcare environment.
                </p>
                <a
                  href="/"
                  className="text-blue-600 mt-4 inline-block hover:underline"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>

          {/* Blog Post 2 */}
          <div className="col-span-1">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={blogImage2}
                alt="Healthcare blog 2"
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <span className="text-blue-600 text-sm font-medium">
                  Patient Care
                </span>
                <h5 className="mt-4 text-xl font-semibold">
                  Effective Communication Strategies with Patients
                </h5>
                <p className="mt-2 text-gray-600">
                  Learn the best practices to enhance communication with
                  patients, ensuring a higher level of care.
                </p>
                <a
                  href="/"
                  className="text-blue-600 mt-4 inline-block hover:underline"
                >
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
