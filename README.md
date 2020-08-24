# putty-registery-to-linux-sessions

This tool helps to move putty sessions in windows to linux by taking the **reg** file and converting it to sessions folder.

That folder can be moved inside `~/.putty` folder.

## Usage

```text
putty-registery-to-linux-sessions <registry backup location> [-r C:/replace/string/:/replacement/string/]
-h
  prints this help text
-r C:/replace/string/:/replacement/string/
  replace ppk location with a different location.
  This is useful if you have all your keys in one location.
  Example: -r C:/users/john.doe/.ssh:/media/BackUp/sshkeys/
  Please Note:
  All back slashes are converted to forward slashes in reg file while matching. For windows path, use forward slashes only.
```
