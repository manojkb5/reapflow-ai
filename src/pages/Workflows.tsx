import { useState, useCallback, useEffect } from "react";
import { 
  ReactFlow, 
  Node, 
  Edge, 
  addEdge, 
  Connection, 
  useNodesState, 
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Play, 
  Save, 
  Mail, 
  MessageSquare, 
  Clock, 
  Zap,
  GitBranch,
  Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Custom Node Components
const TriggerNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 bg-primary/20 border border-primary rounded-lg min-w-[150px]">
    <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    <div className="flex items-center gap-2">
      <Zap className="h-4 w-4 text-primary" />
      <span className="text-sm font-medium">{data.label}</span>
    </div>
  </div>
);

const ActionNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 bg-accent/20 border border-accent rounded-lg min-w-[150px]">
    <Handle type="target" position={Position.Top} className="!bg-accent" />
    <Handle type="source" position={Position.Bottom} className="!bg-accent" />
    <div className="flex items-center gap-2">
      {data.type === 'email' && <Mail className="h-4 w-4 text-accent" />}
      {data.type === 'sms' && <MessageSquare className="h-4 w-4 text-accent" />}
      {data.type === 'delay' && <Clock className="h-4 w-4 text-accent" />}
      <span className="text-sm font-medium">{data.label}</span>
    </div>
  </div>
);

const ConditionNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 bg-orange-500/20 border border-orange-500 rounded-lg min-w-[150px]">
    <Handle type="target" position={Position.Top} className="!bg-orange-500" />
    <Handle type="source" position={Position.Bottom} id="yes" className="!bg-orange-500" style={{ left: '25%' }} />
    <Handle type="source" position={Position.Bottom} id="no" className="!bg-orange-500" style={{ left: '75%' }} />
    <div className="flex items-center gap-2">
      <GitBranch className="h-4 w-4 text-orange-500" />
      <span className="text-sm font-medium">{data.label}</span>
    </div>
  </div>
);

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

const Workflows = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<any>(null);
  const [showNewWorkflow, setShowNewWorkflow] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [loading, setLoading] = useState(false);

  const blockTemplates = [
    { type: 'trigger', label: 'New Contact', icon: Zap, data: { trigger_type: 'new_contact' } },
    { type: 'trigger', label: 'Tag Added', icon: Zap, data: { trigger_type: 'tag_added' } },
    { type: 'action', label: 'Send Email', icon: Mail, data: { action_type: 'send_email' } },
    { type: 'action', label: 'Send SMS', icon: MessageSquare, data: { action_type: 'send_sms' } },
    { type: 'action', label: 'Delay', icon: Clock, data: { action_type: 'delay' } },
    { type: 'condition', label: 'If/Then', icon: GitBranch, data: { condition_type: 'if_then' } },
  ];

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const { data, error } = await supabase
        .from('workflows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWorkflows(data || []);
    } catch (error) {
      toast.error('Failed to fetch workflows');
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const blockData = JSON.parse(event.dataTransfer.getData('application/blockdata'));

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left - 75,
        y: event.clientY - reactFlowBounds.top - 25,
      };

      const newNode: Node = {
        id: `${type}_${Date.now()}`,
        type,
        position,
        data: { 
          label: blockData.label, 
          ...blockData.data 
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragStart = (event: React.DragEvent, nodeType: string, blockData: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/blockdata', JSON.stringify(blockData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const createWorkflow = async () => {
    if (!newWorkflowName.trim()) return;
    
    setLoading(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('workflows')
        .insert([
          {
            name: newWorkflowName,
            description: '',
            is_active: false,
            created_by: user.id,
            subaccount_id: '00000000-0000-0000-0000-000000000000' // Default subaccount
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setWorkflows([data, ...workflows]);
      setSelectedWorkflow(data);
      setShowNewWorkflow(false);
      setNewWorkflowName('');
      setNodes([]);
      setEdges([]);
      toast.success('Workflow created successfully');
    } catch (error) {
      toast.error('Failed to create workflow');
    } finally {
      setLoading(false);
    }
  };

  const saveWorkflow = async () => {
    if (!selectedWorkflow) return;

    setLoading(true);
    try {
      // Save workflow blocks
      const blocks = nodes.map(node => ({
        workflow_id: selectedWorkflow.id,
        block_type: node.type,
        block_data: node.data,
        position_x: Math.round(node.position.x),
        position_y: Math.round(node.position.y),
      }));

      // Delete existing blocks
      await supabase
        .from('workflow_steps')
        .delete()
        .eq('workflow_id', selectedWorkflow.id);

      // Insert new blocks as workflow steps
      if (blocks.length > 0) {
        const steps = blocks.map((block, index) => ({
          workflow_id: selectedWorkflow.id,
          step_order: index + 1,
          step_type: block.block_type,
          configuration: block.block_data
        }));

        const { error } = await supabase
          .from('workflow_steps')
          .insert(steps);

        if (error) throw error;
      }

      toast.success('Workflow saved successfully');
    } catch (error) {
      toast.error('Failed to save workflow');
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflow = async (workflow: any) => {
    setSelectedWorkflow(workflow);
    
    try {
      const { data: steps, error } = await supabase
        .from('workflow_steps')
        .select('*')
        .eq('workflow_id', workflow.id)
        .order('step_order');

      if (error) throw error;

      const loadedNodes = (steps || []).map((step, index) => ({
        id: step.id,
        type: step.step_type,
        position: { x: 100 + (index * 200), y: 100 + (index * 100) },
        data: step.configuration || {},
      }));

      setNodes(loadedNodes);
      setEdges([]);
    } catch (error) {
      toast.error('Failed to load workflow');
    }
  };

  const deleteWorkflow = async (workflowId: string) => {
    try {
      const { error } = await supabase
        .from('workflows')
        .delete()
        .eq('id', workflowId);

      if (error) throw error;

      setWorkflows(workflows.filter(w => w.id !== workflowId));
      if (selectedWorkflow?.id === workflowId) {
        setSelectedWorkflow(null);
        setNodes([]);
        setEdges([]);
      }
      toast.success('Workflow deleted successfully');
    } catch (error) {
      toast.error('Failed to delete workflow');
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Workflows List */}
      <div className="w-80 border-r border-border/50 glass">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Workflows</h2>
            <Button
              variant="neon"
              size="sm"
              onClick={() => setShowNewWorkflow(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {showNewWorkflow && (
            <div className="space-y-2">
              <Input
                placeholder="Workflow name"
                value={newWorkflowName}
                onChange={(e) => setNewWorkflowName(e.target.value)}
                className="glass border-primary/20"
              />
              <div className="flex gap-2">
                <Button
                  variant="neon"
                  size="sm"
                  onClick={createWorkflow}
                  disabled={loading}
                >
                  Create
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewWorkflow(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 space-y-2">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedWorkflow?.id === workflow.id
                  ? 'bg-primary/20 border border-primary/50'
                  : 'glass hover:bg-secondary/20'
              }`}
              onClick={() => loadWorkflow(workflow)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-foreground">{workflow.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {new Date(workflow.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={workflow.is_active ? "default" : "secondary"}>
                    {workflow.is_active ? "Active" : "Draft"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWorkflow(workflow.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center - Workflow Canvas */}
      <div className="flex-1 flex flex-col">
        {selectedWorkflow ? (
          <>
            <div className="p-4 border-b border-border/50 glass">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {selectedWorkflow.name}
                  </h1>
                  <p className="text-muted-foreground">
                    Drag blocks from the right panel to build your workflow
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={saveWorkflow}
                    disabled={loading}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="neon">
                    <Play className="h-4 w-4 mr-2" />
                    Test
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                className="bg-background"
              >
                <Background color="#333" />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                No Workflow Selected
              </h2>
              <p className="text-muted-foreground mb-4">
                Select a workflow from the left panel or create a new one
              </p>
              <Button
                variant="neon"
                onClick={() => setShowNewWorkflow(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Workflow
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Block Templates */}
      {selectedWorkflow && (
        <div className="w-64 border-l border-border/50 glass">
          <div className="p-4 border-b border-border/50">
            <h3 className="font-semibold text-foreground">Workflow Blocks</h3>
            <p className="text-xs text-muted-foreground">
              Drag to add to canvas
            </p>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <Label className="text-xs font-medium text-primary">TRIGGERS</Label>
              <div className="space-y-2 mt-2">
                {blockTemplates.filter(b => b.type === 'trigger').map((block, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg glass border border-primary/20 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
                    draggable
                    onDragStart={(event) => onDragStart(event, block.type, block)}
                  >
                    <div className="flex items-center gap-2">
                      <block.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm text-foreground">{block.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-accent">ACTIONS</Label>
              <div className="space-y-2 mt-2">
                {blockTemplates.filter(b => b.type === 'action').map((block, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg glass border border-accent/20 cursor-grab active:cursor-grabbing hover:border-accent/50 transition-colors"
                    draggable
                    onDragStart={(event) => onDragStart(event, block.type, block)}
                  >
                    <div className="flex items-center gap-2">
                      <block.icon className="h-4 w-4 text-accent" />
                      <span className="text-sm text-foreground">{block.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs font-medium text-orange-500">CONDITIONS</Label>
              <div className="space-y-2 mt-2">
                {blockTemplates.filter(b => b.type === 'condition').map((block, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg glass border border-orange-500/20 cursor-grab active:cursor-grabbing hover:border-orange-500/50 transition-colors"
                    draggable
                    onDragStart={(event) => onDragStart(event, block.type, block)}
                  >
                    <div className="flex items-center gap-2">
                      <block.icon className="h-4 w-4 text-orange-500" />
                      <span className="text-sm text-foreground">{block.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workflows;