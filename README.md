RACCIT VCSish
==========

>Задание: Реализовать утилиту, которая бы осуществляла эффективное хранение истории изменений папки с файлами, подобной утилите git. Будучи запущенной в какой-то папке, она должна обрабатывать такие ключи:
>
-s (snapshot) - создать новый снимок состояния директории и записать его в журнал изменений
-h (history) - вывести всю историю изменений
-r <id снимка> (rollback) - вернуться к состоянию директории, которое было на момент снимка с заданным id


TODO:
+ Basic implementation
  + [ ] run strings-alignment on input and version from .raccit folder - one where initial file got changes applied to it
  + [ ] save output, skipping 'KEEP', as new file in .raccit / create 'commit'.
+ CLI support
  + [ ] init    – create .raccit folder
  + [ ] -s      – run 'basic implementation'
  + [ ] -h      – list .raccit commits
  + [ ] -r <id> – undo every .raccit commit up to point of <id>
+ Advanced implementation
  + [ ] try different strings alignment, store code for which 'scheme' is used  
  + [ ] investigate the ways git actually generates IDs for commits, that works in distributed environments
  + [ ] investigate git repack / etc pack-refs
  + [ ] compare size of storing new file instead of storing changes for it.
  + [ ] investigate binary formats / compression possibilities
  + [ ] investigate git structures changes and structures commit
