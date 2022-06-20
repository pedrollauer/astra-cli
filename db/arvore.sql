with recursive arbore as (
        select sub_id, pai_id,nome,1 as lvl  from subprojetos where nome='Historia' 
        union
        select subprojetos.sub_id,subprojetos.pai_id,subprojetos.nome, arbore.lvl+1 as lvl from arbore
        join subprojetos on subprojetos.pai_id=arbore.sub_id
)
select * from arbore;
