const Community = () => {
  return (
    <div className="min-h-screen bg-gray-600">
      <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">VibeTec Community</h1>
        <div className="max-w-4xl mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop" 
            alt="Community"
            className="w-full h-64 object-cover rounded-lg mb-8"
          />
          <p className="text-xl text-gray-600 mb-8">
            Join our vibrant community of tech enthusiasts and industry professionals. 
            Connect, learn, and grow with like-minded individuals passionate about technology.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Networking Events</h3>
              <p className="text-gray-600">Regular meetups and networking opportunities</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Knowledge Sharing</h3>
              <p className="text-gray-600">Share insights and learn from industry experts</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Collaboration</h3>
              <p className="text-gray-600">Work together on innovative projects and ideas</p>
            </div>
          </div>
          <div className="mt-12">
            <button className="btn btn-lg text-black font-bold" style={{backgroundColor: '#BDFF00'}}>
              Join Our Community Today
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Community;
