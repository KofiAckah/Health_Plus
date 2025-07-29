import React from "react";

function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              About Health Plus
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are dedicated to providing comprehensive health and emergency
              response solutions to keep communities safe and healthy.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 mb-4">
                Health Plus is committed to revolutionizing emergency response
                and health management through innovative technology and
                community-centered solutions.
              </p>
              <p className="text-gray-600 mb-4">
                We bridge the gap between emergency services, healthcare
                providers, and community members to ensure rapid, effective
                responses when every second counts.
              </p>
              <p className="text-gray-600">
                Our platform empowers individuals to take control of their
                health while providing emergency services with the tools they
                need to save lives.
              </p>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">
                Our Values
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Rapid Emergency Response</span>
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Community-Centered Care</span>
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Innovation in Healthcare</span>
                </li>
                <li className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Accessibility for All</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Making a Difference
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <p className="text-gray-600">Emergency Support</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">100+</div>
              <p className="text-gray-600">Healthcare Partners</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10k+</div>
              <p className="text-gray-600">Lives Touched</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">99%</div>
              <p className="text-gray-600">User Satisfaction</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
