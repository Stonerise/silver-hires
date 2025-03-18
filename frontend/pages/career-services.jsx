import Navigation from "../components/Navigation";

export default function CareerServices() {
  return (
    <div>
      {/* Header Section */}
      <header className="bg-gray-900 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-center">Senior Jobs</h1>
          <Navigation />
        </div>
      </header>
      
      {/* Content Section */}
      <div className="container mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Career Services</h2>
        <p className="text-center text-lg">Career services and resources coming soon!</p>
      </div>
    </div>
  );
}