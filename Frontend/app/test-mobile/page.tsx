import DashboardLayout from '@/components/layout/dashboard-layout';

export default function TestPage() {
  return (
    <DashboardLayout role="admin" name="Test Dashboard">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Mobile Sidebar Test</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li><strong>Desktop (&ge; 1024px):</strong> Sidebar should be always visible on the left</li>
            <li><strong>Mobile/Tablet (&lt; 1024px):</strong> 
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Sidebar should be hidden by default</li>
                <li>Hamburger menu button (☰) should appear in top-left</li>
                <li>Click hamburger to slide sidebar in from left</li>
                <li>Click any sidebar link → should navigate AND close sidebar</li>
                <li>Click outside sidebar → should close sidebar</li>
              </ul>
            </li>
          </ol>
          
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <p className="text-sm text-gray-600">
              <strong>Debug:</strong> Open browser console (F12) to see click events and navigation logs.
            </p>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded">
            <h3 className="font-semibold">Dashboard</h3>
            <p className="text-sm text-gray-600">Main dashboard view</p>
          </div>
          <div className="bg-green-100 p-4 rounded">
            <h3 className="font-semibold">Data Entry</h3>
            <p className="text-sm text-gray-600">Various data entry forms</p>
          </div>
          <div className="bg-purple-100 p-4 rounded">
            <h3 className="font-semibold">Reports</h3>
            <p className="text-sm text-gray-600">Analytics and reports</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}