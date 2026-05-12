import { AlertCircle, Calendar } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { mockProjects, StatusCategory } from '../data/mockData'

export function CreateUpdate() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    project: '',
    status: 'On Track' as StatusCategory,
    updateBody: '',
    blockers: '',
    statusDate: new Date().toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState<{ project?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const newErrors: { project?: string } = {}
    if (!formData.project) {
      newErrors.project = 'Please select a project'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Simulate form submission
    console.log('Form submitted:', formData)
    navigate('/')
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <div className="h-full overflow-auto bg-neutral-50">
      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h2 className="text-neutral-900 mb-2">Create Status Update</h2>
          <p className="text-neutral-600">Share your progress with the team</p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Dropdown */}
            <div>
              <label htmlFor="project" className="block text-neutral-900 mb-2">
                Project <span className="text-red-500">*</span>
              </label>
              <select
                id="project"
                value={formData.project}
                onChange={(e) => {
                  setFormData({ ...formData, project: e.target.value })
                  setErrors({ ...errors, project: undefined })
                }}
                className={`w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.project ? 'border-red-300 bg-red-50' : 'border-neutral-200'
                }`}
              >
                <option value="">Select a project</option>
                {mockProjects.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
              {errors.project && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.project}</span>
                </div>
              )}
            </div>

            {/* Status Category Selector */}
            <div>
              <label className="block text-neutral-900 mb-3">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['On Track', 'Blocked', 'Needs Review', 'Done'] as StatusCategory[]).map(
                  (status) => (
                    <label
                      key={status}
                      className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.status === status
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={formData.status === status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as StatusCategory,
                          })
                        }
                        className="sr-only"
                      />
                      <span
                        className={
                          formData.status === status ? 'text-blue-700' : 'text-neutral-700'
                        }
                      >
                        {status}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>

            {/* Update Body */}
            <div>
              <label htmlFor="updateBody" className="block text-neutral-900 mb-2">
                Update <span className="text-red-500">*</span>
              </label>
              <textarea
                id="updateBody"
                value={formData.updateBody}
                onChange={(e) => setFormData({ ...formData, updateBody: e.target.value })}
                placeholder="What have you been working on?"
                rows={4}
                className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Blockers (Optional) */}
            <div>
              <label htmlFor="blockers" className="block text-neutral-900 mb-2">
                Blockers <span className="text-neutral-400">(optional)</span>
              </label>
              <textarea
                id="blockers"
                value={formData.blockers}
                onChange={(e) => setFormData({ ...formData, blockers: e.target.value })}
                placeholder="Any blockers or dependencies?"
                rows={3}
                className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Status Date */}
            <div>
              <label htmlFor="statusDate" className="block text-neutral-900 mb-2">
                Status Date
              </label>
              <input
                type="date"
                id="statusDate"
                value={formData.statusDate}
                onChange={(e) => setFormData({ ...formData, statusDate: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Update
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 bg-white text-neutral-700 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
