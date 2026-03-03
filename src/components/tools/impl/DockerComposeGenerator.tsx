'use client';
import { useState, useCallback, memo } from 'react';
import { Container, Copy, Plus, Trash2, Download } from 'lucide-react';

interface Service {
  name: string;
  image: string;
  ports: string[];
  environment: string[];
  volumes: string[];
  dependsOn: string[];
}

const DockerComposeGeneratorComponent = function DockerComposeGenerator() {
  const [services, setServices] = useState<Service[]>([
    { name: 'web', image: 'nginx:latest', ports: ['80:80'], environment: [], volumes: [], dependsOn: [] },
  ]);
  const [version, setVersion] = useState('3.8');
  const [copied, setCopied] = useState(false);

  const addService = useCallback(() => {
    setServices(prev => [...prev, {
      name: `service${prev.length + 1}`,
      image: '',
      ports: [],
      environment: [],
      volumes: [],
      dependsOn: [],
    }]);
  }, []);

  const removeService = useCallback((idx: number) => {
    setServices(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const updateService = useCallback((idx: number, field: keyof Service, value: string | string[]) => {
    setServices(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  }, []);

  const generateYaml = useCallback(() => {
    let yaml = `version: '${version}'\n\nservices:\n`;

    services.forEach(service => {
      if (!service.name || !service.image) return;

      yaml += `  ${service.name}:\n`;
      yaml += `    image: ${service.image}\n`;

      if (service.ports.length > 0 && service.ports[0]) {
        yaml += `    ports:\n`;
        service.ports.filter(p => p).forEach(port => {
          yaml += `      - "${port}"\n`;
        });
      }

      if (service.environment.length > 0 && service.environment[0]) {
        yaml += `    environment:\n`;
        service.environment.filter(e => e).forEach(env => {
          yaml += `      - ${env}\n`;
        });
      }

      if (service.volumes.length > 0 && service.volumes[0]) {
        yaml += `    volumes:\n`;
        service.volumes.filter(v => v).forEach(vol => {
          yaml += `      - ${vol}\n`;
        });
      }

      if (service.dependsOn.length > 0 && service.dependsOn[0]) {
        yaml += `    depends_on:\n`;
        service.dependsOn.filter(d => d).forEach(dep => {
          yaml += `      - ${dep}\n`;
        });
      }

      yaml += '\n';
    });

    return yaml.trim();
  }, [services, version]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateYaml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([generateYaml()], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'docker-compose.yml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const presetTemplates = [
    { name: 'NGINX + App', services: [
      { name: 'nginx', image: 'nginx:alpine', ports: ['80:80'], environment: [], volumes: ['./nginx.conf:/etc/nginx/nginx.conf:ro'], dependsOn: ['app'] },
      { name: 'app', image: 'node:18-alpine', ports: [], environment: ['NODE_ENV=production'], volumes: ['./app:/app'], dependsOn: [] },
    ]},
    { name: 'Node + MongoDB', services: [
      { name: 'app', image: 'node:18-alpine', ports: ['3000:3000'], environment: ['MONGO_URL=mongodb://mongo:27017/db'], volumes: ['./:/app'], dependsOn: ['mongo'] },
      { name: 'mongo', image: 'mongo:6', ports: ['27017:27017'], environment: [], volumes: ['mongo_data:/data/db'], dependsOn: [] },
    ]},
    { name: 'WordPress', services: [
      { name: 'wordpress', image: 'wordpress:latest', ports: ['8080:80'], environment: ['WORDPRESS_DB_HOST=db', 'WORDPRESS_DB_USER=wp', 'WORDPRESS_DB_PASSWORD=secret'], volumes: ['wp_data:/var/www/html'], dependsOn: ['db'] },
      { name: 'db', image: 'mysql:8', ports: [], environment: ['MYSQL_ROOT_PASSWORD=secret', 'MYSQL_DATABASE=wordpress', 'MYSQL_USER=wp', 'MYSQL_PASSWORD=secret'], volumes: ['db_data:/var/lib/mysql'], dependsOn: [] },
    ]},
  ];

  return (
    <div className="space-y-4">
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-200">
        <Container className="w-4 h-4 inline mr-2" />
        <strong>Docker Compose Generator:</strong> Visually build docker-compose.yml files with multiple services, ports, volumes, and dependencies.
      </div>

      {/* Version */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-zinc-300">Version:</label>
        <select
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          className="bg-zinc-800 text-white p-2 rounded-lg border border-zinc-700"
        >
          <option value="3.8">3.8</option>
          <option value="3.9">3.9</option>
          <option value="3">3</option>
          <option value="2.4">2.4</option>
        </select>
        <div className="flex-1" />
        <div className="text-sm text-zinc-400">Templates:</div>
        {presetTemplates.map(template => (
          <button
            key={template.name}
            onClick={() => setServices(template.services)}
            className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-xs rounded-lg"
          >
            {template.name}
          </button>
        ))}
      </div>

      {/* Services */}
      <div className="space-y-4">
        {services.map((service, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <input
                type="text"
                value={service.name}
                onChange={(e) => updateService(idx, 'name', e.target.value)}
                placeholder="Service name"
                className="bg-zinc-800 text-white px-3 py-1 rounded border border-zinc-700 font-mono"
              />
              <button
                onClick={() => removeService(idx)}
                disabled={services.length === 1}
                className="p-1 text-zinc-500 hover:text-red-400 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Image</label>
                <input
                  type="text"
                  value={service.image}
                  onChange={(e) => updateService(idx, 'image', e.target.value)}
                  placeholder="e.g., nginx:alpine"
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Ports (comma-separated)</label>
                <input
                  type="text"
                  value={service.ports.join(', ')}
                  onChange={(e) => updateService(idx, 'ports', e.target.value.split(',').map(p => p.trim()))}
                  placeholder="e.g., 80:80, 443:443"
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Environment (comma-separated)</label>
                <input
                  type="text"
                  value={service.environment.join(', ')}
                  onChange={(e) => updateService(idx, 'environment', e.target.value.split(',').map(p => p.trim()))}
                  placeholder="e.g., NODE_ENV=production"
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Volumes (comma-separated)</label>
                <input
                  type="text"
                  value={service.volumes.join(', ')}
                  onChange={(e) => updateService(idx, 'volumes', e.target.value.split(',').map(p => p.trim()))}
                  placeholder="e.g., ./data:/data"
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-zinc-400 block mb-1">Depends On (comma-separated service names)</label>
                <input
                  type="text"
                  value={service.dependsOn.join(', ')}
                  onChange={(e) => updateService(idx, 'dependsOn', e.target.value.split(',').map(p => p.trim()))}
                  placeholder="e.g., db, redis"
                  className="w-full bg-zinc-800 text-white p-2 rounded border border-zinc-700 text-sm"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addService}
          className="w-full py-2 border border-dashed border-zinc-700 hover:border-zinc-600 rounded-lg text-zinc-400 hover:text-zinc-300 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Generated docker-compose.yml</h3>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-lg flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={downloadFile}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
          </div>
        </div>
        <pre className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 font-mono overflow-x-auto">
          {generateYaml()}
        </pre>
      </div>
    </div>
  );
};

export default memo(DockerComposeGeneratorComponent);
