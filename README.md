RACCIT VCSish
==========

>Задание: Реализовать утилиту, которая бы осуществляла эффективное хранение истории изменений папки с файлами, подобной утилите git. Будучи запущенной в какой-то папке, она должна обрабатывать такие ключи:
>
-s (snapshot) - создать новый снимок состояния директории и записать его в журнал изменений
-h (history) - вывести всю историю изменений
-r <id снимка> (rollback) - вернуться к состоянию директории, которое было на момент снимка с заданным id

# TODO:
+ Basic implementation
  + [X] run strings-alignment on input and version from .raccit folder
  + [X] snapshot -> promote INDEX.json to commit, set new HEAD.json
  + [X] add to stage -> modify INDEX.json
  + [ ] run string-alignment on input and version from .raccit folder with changes from commits applied to it
+ CLI support
  + [ ] init    – create .raccit folder
  + [ ] -s      – run 'basic implementation'
  + [ ] -h      – list .raccit commits
  + [ ] -r <id> – undo every .raccit commit up to point of <id>
+ Semi-advanced implementation
  + [ ] run on folders and subdirectories
  + [ ] optimize checks by tracking commits - file change. Consider
+ Advanced implementation
  + [ ] investigate git structures changes and structures commit
  + [ ] try different strings alignment, store code for which 'scheme' is used  
  + [ ] compare size of storing new file instead of storing changes for it.
  + [ ] investigate binary formats / compression possibilities
  + [ ] investigate git detecting rename of files

# Questions:
+ [ ] Changing alignment to penalize single addition in range of changes - basically, how to turn
  ```
  This is --s---ome ----text

  This is just some new text
  ```
  into
  ```
  This is -----some ----text

  This is just some new text
  ```
+ [X] [Answer](#IDs-for-commits) investigate the ways git actually generates IDs for commits, that works in distributed environments
+ [ ] investigate git repack / etc pack-refs

# Answers

## IDs for commits
Everything in Git is check-summed before it is stored and is then referred to by that checksum. This means it’s impossible to change the contents of any file or directory without Git knowing about it. This functionality is built into Git at the lowest levels and is integral to its philosophy. You can’t lose information in transit or get file corruption without Git being able to detect it.

The mechanism that Git uses for this checksumming is called a SHA-1 hash. This is a 40-character string composed of hexadecimal characters (0–9 and a–f) and calculated based on the contents of a file or directory structure in Git. A SHA-1 hash looks something like this:

24b9da6552252987aa493b52f8696cd6d3b00373
You will see these hash values all over the place in Git because it uses them so much. In fact, Git stores everything in its database not by file name but by the hash value of its contents.

[git-scm](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics#Git-Has-Integrity)
[Code](https://github.com/git/git/blob/3a0f269e7c82aa3a87323cb7ae04ac5f129f036b/sha1_file.c#L186)

## Storing

### Blobs

$ echo sweet > YOUR_FILENAME
$ git init
$ git add .
$ find .git/objects -type f
You’ll see .git/objects/aa/823728ea7d592acc69b36875a482cdf3fd5c8d.

How do I know this without knowing the filename? It’s because the SHA1 hash of:

"blob" SP "6" NUL "sweet" LF
is aa823728ea7d592acc69b36875a482cdf3fd5c8d, where SP is a space, NUL is a zero byte and LF is a linefeed.
You can verify this by typing:

$ printf "blob 6\000sweet\n" | sha1sum

Git is content-addressable: files are not stored according to their filename, but rather by the hash of the data they contain, in a file we call a blob object. We can think of the hash as a unique ID for a file’s contents, so in a sense we are addressing files by their content. The initial blob 6 is merely a header consisting of the object type and its length in bytes; it simplifies internal bookkeeping.

Git only stores the data once.

By the way, the files within .git/objects are compressed with zlib so you should not stare at them directly. Filter them through zpipe -d, or type:

$ git cat-file -p aa823728ea7d592acc69b36875a482cdf3fd5c8d
which pretty-prints the given object.

### Trees

But where are the filenames? They must be stored somewhere at some stage. Git gets around to the filenames during a commit:

$ git commit  # Type some message.
$ find .git/objects -type f
You should now see 3 objects. This time I cannot tell you what the 2 new files are, as it partly depends on the filename you picked. We’ll proceed assuming you chose “rose”. If you didn’t, you can rewrite history to make it look like you did:

$ git filter-branch --tree-filter 'mv YOUR_FILENAME rose'
$ find .git/objects -type f
Now you should see the file .git/objects/05/b217bb859794d08bb9e4f7f04cbda4b207fbe9, because this is the SHA1 hash of its contents:

"tree" SP "32" NUL "100644 rose" NUL 0xaa823728ea7d592acc69b36875a482cdf3fd5c8d
Check this file does indeed contain the above by typing:

$ echo 05b217bb859794d08bb9e4f7f04cbda4b207fbe9 | git cat-file --batch
With zpipe, it’s easy to verify the hash:

$ zpipe -d < .git/objects/05/b217bb859794d08bb9e4f7f04cbda4b207fbe9 | sha1sum
Hash verification is trickier via cat-file because its output contains more than the raw uncompressed object file.

This file is a tree object: a list of tuples consisting of a file type, a filename, and a hash. In our example, the file type is 100644, which means ‘rose` is a normal file, and the hash is the blob object that contains the contents of `rose’.

### Commits

We’ve explained 2 of the 3 objects. The third is a commit object. Its contents depend on the commit message as well as the date and time it was created. To match what we have here, we’ll have to tweak it a little:

$ git commit --amend -m Shakespeare  # Change the commit message.
$ git filter-branch --env-filter 'export
    GIT_AUTHOR_DATE="Fri 13 Feb 2009 15:31:30 -0800"
    GIT_AUTHOR_NAME="Alice"
    GIT_AUTHOR_EMAIL="alice@example.com"
    GIT_COMMITTER_DATE="Fri, 13 Feb 2009 15:31:30 -0800"
    GIT_COMMITTER_NAME="Bob"
    GIT_COMMITTER_EMAIL="bob@example.com"'  # Rig timestamps and authors.
$ find .git/objects -type f
You should now see .git/objects/49/993fe130c4b3bf24857a15d7969c396b7bc187 which is the SHA1 hash of its contents:

"commit 158" NUL
"tree 05b217bb859794d08bb9e4f7f04cbda4b207fbe9" LF
"author Alice <alice@example.com> 1234567890 -0800" LF
"committer Bob <bob@example.com> 1234567890 -0800" LF
LF
"Shakespeare" LF
As before, you can run zpipe or cat-file to see for yourself.

This is the first commit, so there are no parent commits, but later commits will always contain at least one line identifying a parent commit.

## Notes on storing

+ If your project is very large and contains many unrelated files that are constantly being changed, Git may be disadvantaged more than other systems because single files are not tracked. Git tracks changes to the whole project, which is usually beneficial.
+ Uses [zlib](http://www.zlib.net/)

# Links

+ [Source github.com/git/git](https://github.com/git/git)
+ [git for computer scientists](http://eagain.net/articles/git-for-computer-scientists/)
+ [Git from the bottom up](https://jwiegley.github.io/git-from-the-bottom-up/)
+ [Git magic](http://www-cs-students.stanford.edu/~blynn/gitmagic/ch08.html)
+ [https://lkml.org/lkml/2005/4/6/121](https://lkml.org/lkml/2005/4/6/121)
+ [git.scm Git Internals - Plumbing and Porcelain](https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain)
+ [Linus Torvalds on git](https://www.youtube.com/watch?v=4XpnKHJAok8)
+ [gitrepository-layout(5) Manual Page](https://www.kernel.org/pub/software/scm/git/docs/gitrepository-layout.html)

+ [Git is Simpler Than you think](http://nfarina.com/post/9868516270/git-is-simpler)
+ [Undoing things in git](https://git-scm.com/book/en/v2/Git-Basics-Undoing-Things#_undoing)
+ [Git has integrity](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics#Git-Has-Integrity)
+ [Commaneder](https://www.npmjs.com/package/commander)
+ [What do I need to read to understand how git works](http://stackoverflow.com/questions/261557/what-do-i-need-to-read-to-understand-how-git-works)
