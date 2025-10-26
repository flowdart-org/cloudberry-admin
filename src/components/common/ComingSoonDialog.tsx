import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Bell, Sparkles } from 'lucide-react';

interface ComingSoonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ComingSoonDialog = ({ open, onOpenChange }: ComingSoonDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-card">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Bell className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-semibold flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Coming Soon
            <Sparkles className="h-5 w-5 text-primary" />
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Notifications feature is currently under development. 
            Stay tuned for real-time updates on orders, users, and system activities.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border">
          <p className="text-sm text-center text-foreground/80">
            We're working hard to bring you the best notification experience
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
