create table grouplist
(
    id        varchar(255)                        not null
        primary key,
    username  varchar(255)                        null,
    starttime time                                null,
    endtime   time                                null,
    join_in   timestamp default CURRENT_TIMESTAMP null
);

create table users
(
    id       varchar(255)                        not null
        primary key,
    username varchar(255)                        null,
    name     varchar(255)                        null,
    join_in  timestamp default CURRENT_TIMESTAMP null
);

create table attendance
(
    id      int auto_increment
        primary key,
    userid  varchar(255)                        null,
    groupid varchar(255)                        null,
    status  int                                 null,
    active  int                                 null,
    close   time      default '00:00:00'        null,
    join_in timestamp default CURRENT_TIMESTAMP null,
    constraint attendance_users_id_fk
        foreign key (userid) references users (id)
            on update cascade on delete cascade
);


