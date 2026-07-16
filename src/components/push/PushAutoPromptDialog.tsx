import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnable: () => void | Promise<void>;
};

export function PushAutoPromptDialog({ open, onOpenChange, onEnable }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background text-foreground border-border">
        <AlertDialogHeader>
          <AlertDialogTitle>Enable push notifications</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            iOS requires one tap to show the system “Allow Notifications” popup. Tap
            Continue, then press Allow.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Not now</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              void onEnable();
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
