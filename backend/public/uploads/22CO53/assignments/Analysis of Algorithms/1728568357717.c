/*
Name :- Shaikh Mohd Zain Asif
Roll no :- 22CO53
Batch :- 3
Aim :- Write a program to demonstrate the concept of non-preemtive scheduling algorithms
*/

#include<stdio.h>
 
 int main()
 
{
    int n,bt[30],wait_t[30],turn_ar_t[30],av_wt_t=0,avturn_ar_t=0,i,j;
    printf("Please enter the total number of processes(maximum 30):");
    scanf("%d",&n);
 
    printf("\nEnter The Process Burst Time");
    for(i=0;i<n;i++) 
    {
        printf("P[%d]:",i+1);
        scanf("%d",&bt[i]);
    }
 
    wait_t[0]=0;   
 
    for(i=1;i<n;i++)
    {
        wait_t[i]=0;
        for(j=0;j<i;j++)
            wait_t[i]+=bt[j];
    }
 
    printf("\nProcess\t\tBurst Time\tWaiting Time\tTurnaround Time");
 
    for(i=0;i<n;i++)
    {
        turn_ar_t[i]=bt[i]+wait_t[i];
        av_wt_t+=wait_t[i];
        avturn_ar_t+=turn_ar_t[i];
        printf("\nP[%d]\t\t%d\t\t\t%d\t\t\t\t%d",i+1,bt[i],wait_t[i],turn_ar_t[i]);
    }
 
    av_wt_t/=i;
    avturn_ar_t/=i;  
    printf("\nAverage Waiting Time:%d",av_wt_t);
    printf("\nAverage Turnaround Time:%d",avturn_ar_t);
 
    return 0;
}
/*
Output:- 

aiktc@aiktc12:~/Desktop$ gcc fcfs.c -o fcfs
aiktc@aiktc12:~/Desktop$ ./fcfs
Please enter the total number of processes(maximum 30):2

Enter The Process Burst TimeP[1]:12
P[2]:12

Process		Burst Time	Waiting Time	Turnaround Time
P[1]		12			0				12
P[2]		12			12				24
Average Waiting Time:6
Average Turnaround Time:18

*/
