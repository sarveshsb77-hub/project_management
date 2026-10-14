 import { Card, Button } from '../components/common/CommonComponents'
import { Edit } from 'lucide-react'

export default function Profile() {
  return (
    <div>
      <div className="mb-6"><h2 className="page-title">Profile</h2><p className="text-muted">Your personal details</p></div>
      <div className="grid grid-cols-3 gap-3">
        <Card className="col-span-1 text-center">
          <div className="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold mx-auto mb-3">JD</div>
          <h3 className="font-bold">John Doe</h3>
          <p className="text-muted">Project Manager</p>
          <Button variant="primary" className="mt-3" size="sm"><Edit size={16} /> Edit Profile</Button>
        </Card>
        <Card className="col-span-2">
          <h4 className="mb-3">About Me</h4>
          <p className="text-muted mb-3">Passionate project manager with 5+ years of experience in software development.</p>
          <div className="grid grid-cols-2 gap-3"><div><span className="text-muted">Email</span><p>john@company.com</p></div><div><span className="text-muted">Phone</span><p>+1 (555) 123-4567</p></div><div><span className="text-muted">Department</span><p>Engineering</p></div><div><span className="text-muted">Joined</span><p>Jan 2023</p></div></div>
          <div className="mt-4"><span className="text-muted">Skills</span><div className="flex gap-2 mt-1"><span className="badge badge-primary">React</span><span className="badge badge-primary">Project Management</span><span className="badge badge-primary">Agile</span></div></div>
        </Card>
      </div>
    </div>
  )
}